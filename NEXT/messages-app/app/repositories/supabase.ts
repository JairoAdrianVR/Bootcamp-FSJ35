import {createClient} from '@supabase/supabase-js'

const supabaseUrl = "";
const supabaseKey = "";

//Creamos la conexion con supabase

export const supabaseAdmin = createClient(supabaseUrl,supabaseKey,{
    auth: { persistSession: false, autoRefreshToken: false },
  });