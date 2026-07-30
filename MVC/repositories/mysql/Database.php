<?php 

class Database{
    private $host = "127.0.0.1";
    private $port = "3306";
    private $db_name = "tiendita";
    private $username = "root";
    private $password = "";
    private PDO | null $connect;

    function getConnection(){
        $this->connect = null;

        try{
            $dsn = "mysql:host=".$this->host.";port=".$this->port.";dbname=".$this->db_name;
          $this->connect = new PDO($dsn,$this->username,$this->password);
          $this->connect->exec("set names utf8");
        }catch (PDOException $error){
            echo "Error de conexion: ".$error->getMessage();
        }

        return $this->connect;
    }
}

?>