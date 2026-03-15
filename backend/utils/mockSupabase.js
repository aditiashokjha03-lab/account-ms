// Mock Supabase Client for Demo Purposes
class MockSupabase {
  constructor() {
    this.users = [];
    this.transactions = [];
  }

  from(table) {
    const self = this;
    return {
      select: (fields) => ({
        eq: (col, val) => ({
          single: async () => {
            const match = self.users.find(u => u[col] === val);
            return { data: match || null, error: null };
          }
        }),
        neq: (col, val) => ({
          async then(resolve) {
            const matches = self.users.filter(u => u[col] !== val);
            resolve({ data: matches, error: null });
          }
        }),
        async then(resolve) {
          if (table === 'users') resolve({ data: self.users, error: null });
          if (table === 'transactions') resolve({ data: self.transactions, error: null });
        },
        or: (query) => ({
          order: (col, { ascending }) => ({
            async then(resolve) {
              // Simple filter for sender_id or receiver_id
              const userId = query.match(/eq\.([^,]+)/)[1];
              const matches = self.transactions.filter(t => t.sender_id === userId || t.receiver_id === userId);
              resolve({ data: matches, error: null });
            }
          })
        })
      }),
      insert: (records) => ({
        select: () => ({
          single: async () => {
            const newRecord = { ...records[0], id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() };
            if (table === 'users') self.users.push(newRecord);
            if (table === 'transactions') {
              records.forEach(r => {
                const tx = { ...r, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() };
                // Add mock sender/receiver names for the join
                const s = self.users.find(u => u.id === r.sender_id);
                const rec = self.users.find(u => u.id === r.receiver_id);
                tx.sender = { name: s?.name || 'System' };
                tx.receiver = { name: rec?.name || 'System' };
                self.transactions.push(tx);
              });
            }
            return { data: newRecord, error: null };
          }
        }),
        async then(resolve) {
          records.forEach(r => {
            const tx = { ...r, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() };
            const s = self.users.find(u => u.id === r.sender_id);
            const rec = self.users.find(u => u.id === r.receiver_id);
            tx.sender = { name: s?.name || 'System' };
            tx.receiver = { name: rec?.name || 'System' };
            self.transactions.push(tx);
          });
          resolve({ data: null, error: null });
        }
      }),
      update: (updates) => ({
        eq: (col, val) => ({
          select: () => ({
            single: async () => {
              const idx = self.users.findIndex(u => u[col] === val);
              if (idx !== -1) {
                self.users[idx] = { ...self.users[idx], ...updates };
                return { data: self.users[idx], error: null };
              }
              return { data: null, error: 'User not found' };
            }
          }),
          async then(resolve) {
            const idx = self.users.findIndex(u => u[col] === val);
            if (idx !== -1) self.users[idx] = { ...self.users[idx], ...updates };
            resolve({ data: null, error: null });
          }
        })
      })
    };
  }
}

const mockSupabase = new MockSupabase();

// Pre-populate with a demo receiver
mockSupabase.users.push({
  id: 'demo-receiver-id',
  name: 'Demo Receiver',
  email: 'receiver@demo.com',
  password: 'hashed',
  balance: 5000,
  created_at: new Date().toISOString()
});

module.exports = mockSupabase;
