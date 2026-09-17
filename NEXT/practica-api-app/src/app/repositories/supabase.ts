import {createClient} from '@supabase/supabase-js'

const supabaseUrl = "https://povmazytufoyroyijfms.supabase.co";
const supabaseKey = "sb_publishable_0vzdlCFS_f4KlfdTJbXEKg_ePyFyHKG";

//Creamos la conexion con supabase

export const supabase = createClient(supabaseUrl,supabaseKey);