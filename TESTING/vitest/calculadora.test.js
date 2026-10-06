import { describe, expect, it } from "vitest";
import { esMayorDeEdad, restar, sumar } from "./calculadora";

//Crear un test
describe('Test de la funcion sumar',() => {
    
    //Preparar el caso para este test
    it('sumar dos numeros positivos de forma correcta', () => {
    //3 fases del test

    // 1. Preparar -> Definir los datos que necesitamos para param
    const num1 = 4;
    const num2 = 7;

    // 2. Actuar -> Ejecutar la funcion con los datos que preparamos
    const resultado = sumar(num1,num2);

    // 3. Afirmar -> Verificar el resultado si es lo que esperamos

    expect(resultado).toBe(11);
    })

   
})

describe('Vamos a testear la calculadora de nuevo',()=> {
    //Creamos los casos para testear

    it('restar dos numeros enteros y positivos de forma correcta',() => {
        // 1era fase de test -> Preparar los datos

        const num1 = 21;
        const num2 = 8;

        // 2da fase de test -> Actuar, ejecutar la funcion
        const resultado = restar(num1,num2)

        // 3era fase de test -> Afirmar
        expect(resultado).toBe(13);
    })

})

describe('Funcion de esMayorDeEdad', () => {

    it('En caso true de que la edad sea mayor', () =>{
        // 1er paso
        const edad = 19;
        //2do paso
        const resultado = esMayorDeEdad(edad);
        //3er paso
        expect(resultado).toBe(true);
    })
})