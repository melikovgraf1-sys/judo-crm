import { createClient } from '@supabase/supabase-js';

// Load environment variables during tests only. When building for the browser,
// this conditional evaluates to `false` at compile time so `@next/env` and its
// `fs` dependency are not bundled, avoiding build-time errors.
if (process.env.NODE_ENV === 'test') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@next/env').loadEnvConfig(process.cwd());
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
