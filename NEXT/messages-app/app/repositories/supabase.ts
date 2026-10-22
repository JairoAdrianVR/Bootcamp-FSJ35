import {createClient} from '@supabase/supabase-js'

const supabaseUrl = "https://rdlmlwspvvccntbxehuj.supabase.co";
const supabaseKey = "sb_publishable_x8J7JFBI9muj_DXDVG_q-A_T37lNLwd";

//Creamos la conexion con supabase

export const supabaseAdmin = createClient(supabaseUrl,supabaseKey,{
    auth: { persistSession: false, autoRefreshToken: false },
  });