//rfc -> snippet
"use client";
import { guardarFavorito } from "../actions/favoritos";

//Declarar la interface para las props
interface CardCharacterProps {
  id:number;
    nombre:string;
    estado:string;
    imagen:string;
}

export default function CardCharacter({id,nombre,estado,imagen}: CardCharacterProps) {

  const handleGuardar = async () => {
    const pj = {
      id: id,
      name: nombre,
      status: estado,
      image: imagen
    }

    await guardarFavorito(pj);
    alert("Guardado en favoritos!");
  }

  return (
   <article className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-green-500/20">
      <img
        src={imagen}
        alt={nombre}
        className="h-64 w-full object-cover"
      />

      <div className="flex min-h-56 flex-col p-5">
        <h2 className="mb-3 text-xl font-bold text-white">
          {nombre}
        </h2>

        <div className="mb-2 flex items-center gap-2">
          <p className="text-sm text-slate-300">Estado: {estado}</p>
        </div>

          <button
            type="button"
            onClick={handleGuardar}
            className="mt-auto rounded-lg bg-green-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:bg-slate-500"
          >
            Guardar en favoritos
          </button>
      </div>
    </article>
  )
}
