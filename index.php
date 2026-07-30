<?php 
    
    // COMENTARIO DE UNA LINEA

    /* comentario
    multi
    lineas
    */
    

    // Guardamos datos en? VARIABLES

    $variablecita  = "Holiwis";

    // IMPRIMIR DATOS
    echo $variablecita;

    // Operadores
    // Matematico
    // RESIDUO

    $residuo = 7 % 3;
    
    echo $residuo."\n";

    // Operadores de comparacion
    // > < <= >=
    //Igualdad compara solamente el VALOR de las variables o los datos
    $igualdad = 5 == "5";

    // Igualdad estricta COMPARA VALOR y TIPO DE DATO
    $igualdadEstricta = 5 === "5";

    print $igualdad."\n";
    print $igualdadEstricta."\n";

    //Funciones
    // Crea una funcion que salude al usuario mostrando un mensaje
    function saludar(){
        //Imprimir un mensaje
        print "Holiwis desde la funcion saludar";
    }
    // $resultadoSaludo = saludar();
    saludar();
    //print( $resultadoSaludo);

    // Crea una funcion que DEVUELVA el resultado de una suma

    function sumar(){
        return 5+5;
    }

    //Ejecuto/llamo a la funcion
    $resultado = sumar();
    
    //Var_dump imprime el valor y nos da informacion de su tipo de dato
    var_dump($resultado);

    
    
?>
