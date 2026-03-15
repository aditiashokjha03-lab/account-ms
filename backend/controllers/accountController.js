const supabase = require('../config/supabase');

exports.getBalance = async (req, res) => {
  try {
    const { id } = req.user;
    const { data: user, error } = await supabase
      .from('users')
      .select('balance')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.status(200).json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStatement = async (req, res) => {
  try {
    const { id } = req.user;
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        *,
        sender:sender_id(name),
        receiver:receiver_id(name)
      `)
      .or(`sender_id.eq.${id},receiver_id.eq.${id}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { id } = req.user;
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email')
      .neq('id', id);

    if (error) throw error;
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.transferMoney = async (req, res) => {
  try {
    const { receiverId, receiverEmail, amount } = req.body;
    const senderId = req.user.id;

    if ((!receiverId && !receiverEmail) || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid receiver or amount' });
    }

    // Get sender balance
    const { data: sender, error: senderError } = await supabase
      .from('users')
      .select('balance')
      .eq('id', senderId)
      .single();

    if (senderError) throw senderError;

    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Get receiver
    let receiver;
    if (receiverId) {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', receiverId)
        .single();
      receiver = data;
    } else {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', receiverEmail)
        .single();
      receiver = data;
    }

    if (!receiver) {
      return res.status(400).json({ message: 'Receiver not found' });
    }

    const actualReceiverId = receiver.id;
    
    if (actualReceiverId === senderId) {
      return res.status(400).json({ message: 'Cannot transfer to yourself' });
    }

    // Perform transaction using Supabase RPC or multi-step if not using RPC
    // For simplicity, we'll do it in steps here, but ideally this should be a DB transaction.
    
    // Deduct from sender
    const { data: updatedSender, error: deductError } = await supabase
      .from('users')
      .update({ balance: sender.balance - amount })
      .eq('id', senderId)
      .select()
      .single();

    if (deductError) throw deductError;

    // Add to receiver
    const { data: receiverData } = await supabase
      .from('users')
      .select('balance')
      .eq('id', actualReceiverId)
      .single();

    const { error: addError } = await supabase
      .from('users')
      .update({ balance: Number(receiverData.balance) + Number(amount) })
      .eq('id', actualReceiverId);

    if (addError) throw addError;

    // Create transaction entries
    // Two entries as requested: Debit for sender, Credit for receiver
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert([
        { sender_id: senderId, receiver_id: actualReceiverId, amount, transaction_type: 'debit' },
        { sender_id: senderId, receiver_id: actualReceiverId, amount, transaction_type: 'credit' }
      ]);

    if (transactionError) throw transactionError;

    res.status(200).json({ message: 'Transfer successful', newBalance: updatedSender.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
