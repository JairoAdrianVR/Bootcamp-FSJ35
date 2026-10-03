import { createBrowserClient } from "@supabase/ssr";


const supabaseUrl = "";
const supabaseKey = "";

export function createClient() {
  return createBrowserClient(
    supabaseUrl!,
    supabaseKey!
  );
}