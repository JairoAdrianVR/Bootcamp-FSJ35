import { createBrowserClient } from "@supabase/ssr";


const supabaseUrl = "https://rdlmlwspvvccntbxehuj.supabase.co";
const supabaseKey = "sb_publishable_x8J7JFBI9muj_DXDVG_q-A_T37lNLwd";

export function createClient() {
  return createBrowserClient(
    supabaseUrl!,
    supabaseKey!
  );
}