
export function sumar(a,b) {
  return a+b;
}


export function restar(a,b){
    return a-b;
}

// CREAR UNA FUNCION PARA OBTENER LA EDAD Y VALIDAR SI ES MAYOR DE 18 AÑOS
// Test respectivo para esa funcion

export function esMayorDeEdad(edad){
    if(edad < 0 ) throw new Error("La edad no puede ser menor a 0, seriedad porfa.");

    return edad >= 18;
}