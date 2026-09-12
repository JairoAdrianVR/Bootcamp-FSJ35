import {createClient} from '@supabase/supabase-js'

const supabaseUrl = "";
const supabaseKey = "";

//Creamos la conexion con supabase

export const supabase = createClient(supabaseUrl,supabaseKey);