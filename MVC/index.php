<?php 


require './controllers/ProductoController.php';
$controller = new ProductController();

$action = isset($_GET['action']) ? $_GET['action'] : 'read';
switch($action){
    case 'read':
        $controller->read();
        break;
    case 'create':
        $controller->create();
        break;
    case 'update':
        $controller->update();
        break;
    case 'delete':
        $controller->delete();
        break;
}

//BUSCAR EL ARCHIVO Y TRAERLO A DONDE LO VAN A UTILIZAR
        /**
         * Require -> Va a buscar el archivo y traerlo, si NO FUNCIONA, va a frenar el codigo
         * Include -> Va a buscar el archivo y traerlo, si NO FUNCIONA, va a seguir la ejecucion
         */

        
        require './repositories/mysql/Database.php';
        //include


        //Aca creo la base de datos para poner obtener el objeto inicial
        $database = new Database(); 

        //Crear la conexion con esa conexion ya puedo trabajar
        $db = $database->getConnection();

        print_r($db);
?>


