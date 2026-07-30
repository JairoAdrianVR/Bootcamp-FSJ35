<?php 
/**
 * PILARES POO -> 4 PILARES QUE NO SON NEGOCIABLES
 * 
 * 
 * 1- Encapsulamiento => LIMITAR EL ACCESO A LOS DATOS DE UNA CLASE -> Proteger datos
 * Los modificadores de acceso son la forma mas facil de identificar al encapsulamiento
 * 2- Abstraccion => Creando una forma (metodos) para interactuar con los datos limitados en su acceso
 * 1er concepto - Dar acceso a datos encapsulados de la clase (dejar que interactuen con esos datos CONTROLADOS)
 * 2do concepto - Mostrar los datos esenciales de esa clase ignorando los detalles complejos
 * 
 * 3- Herencia -> Una clase hija HEREDA comportamientos y caracteristicas del padre
 * 4- Polimorfismo -> Un comportamiento de la clase padre lo cambiamos en la clase hija
 * 
 */

class Persona{
    private string $nombre;
    private int $dui;
    private int $edad;

    function  __construct(string $param_nombre, int $param_dui,int $param_edad)
    {
        $this->nombre = $param_nombre;
        $this->dui = $param_dui;
        $this->edad = $param_edad;
    }

    function getDui(){
        return $this->dui;
    }

    function getNombre(){
        return $this->nombre;
    }

    function getEdad(){
        return $this->edad;
    }

    function setEdad(int $param_edad){
        if($param_edad === $this->edad + 1 || $param_edad === $this->edad - 1 ){
            $this->edad = $param_edad;
        }
    }

    function dormir(){
        return "Estoy durmiendo placidamente";
    }

}

//Activamos la HERENCIA con la palabra EXTENDS
class Programador extends Persona{
    private string $tech_skills; // atributos/propiedades osea caracteristica


    function __construct(string $param_tech_skills,string $param_nombre,int $param_dui, int $p_edad)
    {
       //parent:: ES PODER ACCEDER A ALGO DEL PADRE DE ESTA CLASE
        parent::__construct($param_nombre,$param_dui,$p_edad);
        $this->tech_skills = $param_tech_skills;
    }

    function picarCodigo(){
        return "Estoy codeando y no durmiendo...";
    }

    //1er concepto de la abstraccion o PARTE DEL ENCAPSULAMIENTO
    // GETTERS Y SETTERS para interactuar con los datos limitados
    function getTechSkills(){
        return $this->tech_skills;
    }

    function setTechSkills(string $param_ts){
        $this->tech_skills = $param_ts;
    }

    //2do concepto -> Mostrar con formato LOS DATOS NECESARIOS
    function printProgramador(){
        return "El programador maneja estos lenguajes: ".$this->tech_skills;
    }

    function dormir(){
        return "No puedo dormir porque se me ocurrio la solucion del codigo.";
    }
}


$jairito = new Programador("Js,React,Ts,PHP","Jairo",1235124,75);
//$jairito->tech_skills = "Java,Kotlin";
//print $jairito->tech_skills;
$jairito->setTechSkills("Java,Kotlin,Swift");
print($jairito->getTechSkills());
echo "\n";
print($jairito->picarCodigo());
echo "\n";
//print($jairito->printProgramador());
print_r($jairito);



?>
