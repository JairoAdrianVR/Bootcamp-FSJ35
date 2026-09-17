// Componente SERVERC.

import CardCharacter from "./components/CardCharacter";
import Navbar from "./components/Navbar";
import Navigation from "./components/Navigation";
import { Character } from "./types";

interface HomeProps{
  searchParams: Promise<{page?:string}>
}

export default async function Home({searchParams}: HomeProps) {
  

  const params = await searchParams;
  //Template string -> En una sintaxis poder concatenar valores de JS a un string
  console.log(`Params: ${params.page}`)

  const currentPage:number = Number(params?.page) || 1;

  //MANDAR A FETCH A BUSCAR NUESTROS PERSONAJES
  const resultado = await fetch(`https://rickandmortyapi.com/api/character/?page=${currentPage}`)
  const data = await resultado.json();
  console.log(data);
 
  const personajes = data?.results;
  const totalPaginas = data?.info.pages;

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      {/* INGRESAR UNA NAVBAR (ES UN COMPONENTE NAVBAR) CON: ------------ RETO ------------
      nombre de la app
      2 hipervinculos:
      - Home
      - Favoritos

      TIENE QUE ESTAR ESTILIZADO CON TAILWIND
      */}

      <Navbar />
      <section className="mt-4 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {personajes.map( (pj:Character) => { 
            return <CardCharacter key={pj.id} id={pj.id} nombre={pj.name} imagen={pj.image} estado={pj.status}/>
        })}
      </section>
      <Navigation totalPages={totalPaginas} currentPage={currentPage} />
    </div>
  );
}


//dDzIecFJwel5z2Ba