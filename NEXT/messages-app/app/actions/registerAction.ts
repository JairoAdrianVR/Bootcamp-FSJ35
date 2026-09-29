import { error } from "console";
import { supabase } from "../repositories/supabase";

async function registerAction(formData: FormData){
    //Obtengo los DATOS con GET
   const name =  formData.get('name') as string;
   const email =  formData.get('email') as string;
   const password = formData.get('password') as string;
   const avatar = formData.get('avatar') as File | null;

   //Validar que el EMAIL no exista previamente

   const {data:existingUser } = await supabase.from('profiles').select('id').eq('email',email);

   if(existingUser){
        return {error: "Este correo ya esta utilizado."}
   }

   //Guardar el avatar
}