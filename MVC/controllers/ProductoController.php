<?php 
    require './repositories/mysql/Database.php';
    require './models/Product.php';

class ProductController{
    private $productModel;

    public function __construct(){
        //Aca creo la base de datos para poner obtener el objeto inicial
        $database = new Database(); 

        //Crear la conexion con esa conexion ya puedo trabajar
        $db = $database->getConnection();

       $this->productModel = new Product($db);
    }

    public function read(){
      /* $products = [[
            'id'=>1,
            'nombre' => "Mouse",
            'cantidad' => 2,
            'descuento' => 5,
            'precio' => 150
        ]];*/
         $products = $this->productModel->getAll();

        include_once './views/home.php';

        
    }

    public function create(){


        include_once './views/create.php';
    }

    public function update(){

        include_once './views/edit.php';
    }

    public function delete(){

    }
}

?>