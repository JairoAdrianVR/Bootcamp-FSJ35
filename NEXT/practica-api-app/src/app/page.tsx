// Componente SERVERC.

import CardCharacter from "./components/CardCharacter";
import Navbar from "./components/Navbar";

import { Character } from "./types";


export default async function Home() {

  //MANDAR A FETCH A BUSCAR NUESTROS PERSONAJES
  const resultado = await fetch('https://rickandmortyapi.com/api/character')
  const data = await resultado.json();
  console.log(data);
 
  const personajes = data.results;

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Holiwis</h1>
      {/* INGRESAR UNA NAVBAR (ES UN COMPONENTE NAVBAR) CON: ------------ RETO ------------
      nombre de la app
      2 hipervinculos:
      - Home
      - Favoritos

      TIENE QUE ESTAR ESTILIZADO CON TAILWIND
      */}

      <Navbar />
        {personajes.map( (pj:Character) => { 
            return <CardCharacter key={pj.id} id={pj.id} nombre={pj.name} imagen={pj.image} estado={pj.status}/>
        })}

    </div>
  );
}


//dDzIecFJwel5z2Ba