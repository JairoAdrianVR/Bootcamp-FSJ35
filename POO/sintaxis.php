<?php 

//Paradigma de programacion -> FORMAS DE PROGRAMAR

// POO -> Programacion orientada a objetos -> OOP

// PARA QUE EL PROGRAMA FUNCIONE VAMOS A NECESITAR CREAR OBJETOS 

// Que es un objeto? ES ALGO QUE CREAMOS EN BASE A UNA CLASE

// Que es una clase? Es un molde de algo que podemos describir


class Usuario {

    // Una clase puede tener 3 cosas
    // Atributos/propiedades -> CARACTERISTICAS PROPIAS DE ESA CLASE
    private $id;
    private $nombre_usuario;
    private $contrasenia;

    //CONSTRUCTOR -> ES LA FUNCION QUE SE EJECUTA CUANDO PONEMOS NEW [nombre_clase]
    function __construct(string $param_nombre_usuario,string $param_contrasenia, int $param_id)
    {
        //APARECE UNA PALABRA RESERVADA PARA LAS CLASES
        $this->nombre_usuario = $param_nombre_usuario;
        $this->contrasenia = $param_contrasenia;
        $this->id = $param_id;
    }

    //METODOS -> Comportamientos de esa clase
    function login(){
        return "Estoy logeando";
    }
}

// CREAR O INSTANCIAR UN OBJETO A TRAVES DE UNA CLASE

$usuario1 = new Usuario("jairo-kpo","jairorekpo123",54);

print_r($usuario1);
?>