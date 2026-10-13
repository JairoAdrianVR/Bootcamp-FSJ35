import {expect, test, vi} from 'vitest';

//Creamos 1 SOLO TEST
test('Primer mock', () => {
    // 1. Preparar -> Declaramos los argumentos
    // Creo una funcion a traves de vitest, esta funcion es un 'mock' o una funcion temporal de test
    const funcionDeMentiritas = vi.fn().mockReturnValue('Jairo');

    // 2. Actuar -> Ejecutamos la funcion de mentiritas con parametros
    //funcionDeMentiritas('Jairo',75); Este sirve para los toHaveBeen
    const resultado = funcionDeMentiritas('Jairo',75);

    // 3. Afirmar -> Verificamos que pasa con nuestro resultado
    //Vemos nuevas formas de testeo

    //Evaluamos la funcion, Si se llamo, cuantas veces y con que parametros
    //expect(funcionDeMentiritas).toHaveBeenCalled();
    //expect(funcionDeMentiritas).toHaveBeenCalledTimes(1);
    //expect(funcionDeMentiritas).toHaveBeenCalledWith("Jairo",75)
    
    //Evaluamos el RESULTADO o RETURN de la funcion
    expect(resultado).toBe('Jairo');
});