//Hoisting 
// Javascript 'sube' las funciones y se puede acceder desde cualquier lado en el archivo
// PERO, no puede hacer eso mismo con las VARIABLES y CONSTANTES.
let auxiliarDeLlamada; 
console.log(auxiliarDeLlamada);

auxiliarDeLlamada = false;
let parametroFuncion = null;

// creo la funcion
function soyUnMockBasico(param){

    //scope 
    // Cuando declaramos variables o constantes dentro de una funcion
    // afuera no existen
   let auxiliarDeLlamada = true;
    parametroFuncion = param;
}


// llamada o ejecucion de la funcion
soyUnMockBasico("Soy un parametro basico.");



console.log(auxiliarDeLlamada); //false
console.log(parametroFuncion); // "Soy un parametro basico."
