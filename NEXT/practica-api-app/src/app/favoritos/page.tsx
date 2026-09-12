import Link from "next/link";
import { CardCharacter } from "../components";
import { supabase } from "../repositories/supabase"


export default async function page() {
    //Voy a obtener todos los personajes favoritos
    const {data:favoritos,error} = await supabase.from("favoritos").select("*");

  return (
    <div>
            <Link href="/" className="bg-blue-600 text-white font-bold rounded-xl">
            Volver al inicio
            </Link>
        {favoritos?.map((pj) => { 
            return <CardCharacter key={pj.id} id={pj.character_id} nombre={pj.name} imagen={pj.image} estado={pj.status}/>
        })}
    </div>
  )
}
