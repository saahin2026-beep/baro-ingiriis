import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vxrgjwmaxueqeledpvem.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cmdqd21heHVlcWVsZWRwdmVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTk0MTAsImV4cCI6MjA4ODYzNTQxMH0.Pk7H728MPRCn2o4UE66PGf1RpERjjaXvnpprptuItTg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
