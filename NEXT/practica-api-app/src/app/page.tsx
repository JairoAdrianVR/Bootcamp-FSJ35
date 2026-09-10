
export default async function Home() {

  //MANDAR A FETCH A BUSCAR NUESTROS PERSONAJES
  const resultado = await fetch('https://rickandmortyapi.com/api/character')
  const data = await resultado.json();
  console.log(data);

  const personajes = data.results;

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Holiwis</h1>

      { personajes[1].name }
    </div>
  );
}
