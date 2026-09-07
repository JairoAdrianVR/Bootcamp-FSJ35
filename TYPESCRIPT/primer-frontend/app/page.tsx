// Un componente -> HTML Y JS (EN ESTE CASO TypeScript) EN EL MISMO ARCHIVO
"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home(){
  //NO DECLARAMOS MAS VARIBLES CUANDO NECESITAMOS UN DATO MUTABLE
  //let nombre: string = "Jairo";

  //Para utilizar un dato mutable, vamos a declarar un ESTADO
  const [name,changeName] = useState("Pepito fuentes");
  //let pepitoFuentes; 

  //function changeName(parametro){ pepitofuentes =  }
 
  /*
  function cambiarNombre() :string{
      nombre = "Hector";
      return nombre
  }*/

  return (
    <div>
      <Navbar />
      <h1>holiwis {name}</h1>

      <button onClick={() => changeName("Hector")}>MAGIA</button>
      <Footer />
    </div>
  )
}