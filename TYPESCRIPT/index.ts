// DIFERENCIAS ENTRE TS Y PHP 

/*
COMENTARIO MULTI LINEA 
*/

// Variables $nombreVariable
// Declaramos variables con LET

let variablecita : string = "holiwis";

// Declarar una constante
const constante : number = 3.1416;

//JAVASCRIPT CON TIPADO DURO
//TIPOS DE DATO -> string, number, boolean 
let booleano : boolean = true;

// IMPRIMIR DATOS
console.log("holiwis");

//Declaracion de funcion
function saludar(): string{
    return "Holiwis como andis?"
}
saludar();

function update (valor : string){
    return "Se actualizo correctamente";
}

let otraVariable : string = "soy otra variable";


//Manejo de arrays
// Array indexado
let arraycito = [1,2,3];
console.log(arraycito[1]);

//Array asociativo -> VAMOS A TENER QUE UTILIZAR UN OBJETO
//Objeto literal
let arraycitoAsociativo = {
    "nombre" : "Jairo"
}

console.log(arraycitoAsociativo['nombre']);

// PODEMOS CREAR TIPOS DE DATOS

type Persona = {
    nombre: string
}

let Jairo : Persona  = {
    "nombre" : "Jairito"
}

function registro(valor : Persona){
    console.log(valor.nombre);
    
}


//Quiero que si o si el producto sea un objeto
type Producto = {
    precio:number
}

function mostrarPrecio(producto: Producto){
    console.log(producto.precio);
}

let producto1 = {
    precio : 15
}

mostrarPrecio(producto1);