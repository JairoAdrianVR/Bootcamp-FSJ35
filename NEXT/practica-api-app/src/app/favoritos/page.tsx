
import Navbar from "../components/Navbar";
import { CardCharacter } from "../components";
import { supabase } from "../repositories/supabase"

export default async function page() {
    //Voy a obtener todos los personajes favoritos
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {data:favoritos,error} = await supabase.from("favoritos").select("*");

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
            <Navbar />

      {/* pt-20 empuja el contenido para que no quede tapado por la navbar fixed (h-20) */}
      <main className="w-full max-w-6xl px-6 pt-20 pb-16">
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mt-10 mb-8 text-center">
          Mis Personajes Favoritos
        </h1>

        {favoritos && favoritos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoritos.map((pj) => {
              return <CardCharacter key={pj.id} id={pj.character_id} nombre={pj.name} imagen={pj.image} estado={pj.status} esFavorito={true}/>
            })}
          </div>
        ) : (
          <p className="text-center text-zinc-500 dark:text-zinc-400">
            Aún no tienes personajes favoritos guardados.
          </p>
        )}
      </main>
    </div>
  )
}
