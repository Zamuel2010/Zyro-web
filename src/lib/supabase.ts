import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rephvbflhmjyemszomca.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlcGh2YmZsaG1qeWVtc3pvbWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQxNTQyNiwiZXhwIjoyMDg4OTkxNDI2fQ.8gQgBs8W3HySj3NEao0NqiFYZPjH1yB0MMReFIN1Is4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    redirectTo: 'https://zyrohub.online/auth/callback'  // Fixes confirmation links
  }
});
