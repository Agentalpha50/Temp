
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://elmkwjmldefcynowezyk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsbWt3am1sZGVmY3lub3dlenlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1MTM3NTcsImV4cCI6MjAzNjA4OTc1N30.-xx9cti6EZxsALkES_MxvhG83GN6So_ni2YEOiKnqQA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;