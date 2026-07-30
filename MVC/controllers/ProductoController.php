<?php 


class ProductController{
    private $productModel;

    public function __construct(){

    }

    public function read(){
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