import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rclclhlxexuneqaciyfe.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_xYGSuE0TZejDPOgr-IYkGg_2p8rEi43';

export const supabase = createClient(supabaseUrl, supabaseKey);
