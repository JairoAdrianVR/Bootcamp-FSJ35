console.log('HOLIWIS ESTOY ANDANDO, SOY EL JS');

function funcionQueHaceMagia(){
//AGARRAR MAS DE UN ELEMENTO
let elementosDOM = document.getElementsByTagName('h1');

console.log(elementosDOM);

//Agarrar 1 elemento
let elementoDOM = document.getElementById('contenido');
console.log(elementoDOM);


elementoDOM.style.backgroundColor = 'red';
elementoDOM.innerHTML = "<h2> Texto cambiado desde JS</h2>"

//Crear un nuevo elemento
let nuevoElemento = document.createElement('h3');
//Le agregamos texto
nuevoElemento.innerText = "Soy un elemento nuevo";
console.log(nuevoElemento);

//Agregamos el nuevo elemento como hijo a el NODO QUE YA EXISTIA
elementoDOM.append(nuevoElemento);


}