export function abrirPortal(dimension,energia, disparador){

    if(energia <= 0){
        return 'Bateria agotada'
    }

    const exito = disparador(dimension);
    
   if(exito){
    return `Portal abierto a la dimension: ${dimension}`
   }else{
    return 'Fallo la creacion del portal'
   }
}