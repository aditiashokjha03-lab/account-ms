const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
  console.log('Using Mock Supabase Client for Demonstration');
  supabase = require('../utils/mockSupabase');
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

module.exports = supabase;
