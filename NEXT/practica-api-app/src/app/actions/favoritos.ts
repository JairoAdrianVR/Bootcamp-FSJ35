import { supabase } from "../repositories/supabase";
import { Character } from "../types";

export async function guardarFavorito(character: Character){

    const {error} = await supabase.from('favoritos').insert([{
        character_id: character.id,
        name: character.name,
        image: character.image,
        status: character.status
    }]);

    if(error){
        console.error("Error al guardar",error);
        return {success:false}
    }

    
    return {success:true}
}
