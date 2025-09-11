import { createClient } from '@supabase/supabase-js';

// When running in Node (e.g. Vitest), ensure `.env` is loaded.
// `@next/env` relies on the `fs` module, so we only require it on the server.
if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@next/env').loadEnvConfig(process.cwd());
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
