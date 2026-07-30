<?php 

class Product {
    private $id;
    private $nombre;
    private $precio;
    private $descuento;
    private $cantidad;
    private $table_name = "productos"; // Nombre corregido según la entidad
    private $db_connection;

    public function __construct($db) {
        $this->db_connection = $db;
    }

    /**
     * Obtiene todos los productos de la base de datos.
     * 
     * @return array Array asociativo con todos los productos registrados.
     */
    public function getAll() {
        $query = "SELECT id, nombre, precio, descuento, cantidad FROM {$this->table_name}";
        $sentence = $this->db_connection->prepare($query);
        $sentence->execute();
        return $sentence->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Crea un nuevo producto en la base de datos.
     * 
     * @param string $nombre    Nombre del producto
     * @param float  $precio    Precio unitario del producto
     * @param float  $descuento Descuento aplicado (ej. en porcentaje o valor fijo)
     * @param int    $cantidad  Cantidad en stock
     * 
     * @return bool Retorna true si la inserción fue exitosa, false en caso contrario.
     */
    public function create($nombre, $precio, $descuento, $cantidad) {
        $query = "INSERT INTO {$this->table_name} (nombre, precio, descuento, cantidad) 
                  VALUES (:nombre, :precio, :descuento, :cantidad)";
        $sentence = $this->db_connection->prepare($query);
        
        $sentence->bindParam(':nombre', $nombre);
        $sentence->bindParam(':precio', $precio);
        $sentence->bindParam(':descuento', $descuento);
        $sentence->bindParam(':cantidad', $cantidad);

        return $sentence->execute();
    }

    /**
     * Actualiza los datos de un producto existente.
     * 
     * @param int    $id        ID del producto a actualizar
     * @param string $nombre    Nuevo nombre
     * @param float  $precio    Nuevo precio
     * @param float  $descuento Nuevo descuento
     * @param int    $cantidad  Nueva cantidad
     * 
     * @return bool Retorna true si la actualización fue exitosa, false en caso contrario.
     */
    public function update($id, $nombre, $precio, $descuento, $cantidad) {
        $query = "UPDATE {$this->table_name} 
                  SET nombre = :nombre, precio = :precio, descuento = :descuento, cantidad = :cantidad 
                  WHERE id = :id";
        $sentence = $this->db_connection->prepare($query);

        $sentence->bindParam(':id', $id);
        $sentence->bindParam(':nombre', $nombre);
        $sentence->bindParam(':precio', $precio);
        $sentence->bindParam(':descuento', $descuento);
        $sentence->bindParam(':cantidad', $cantidad);

        return $sentence->execute();
    } 

    /**
     * Obtiene un producto específico por su ID.
     * 
     * @param int $id ID del producto
     * @return array|false Retorna el array del producto si se encuentra, o false en caso contrario.
     */
    public function getById($id) {
        $query = "SELECT * FROM {$this->table_name} WHERE id = :id";
        $sentence = $this->db_connection->prepare($query);
        $sentence->bindParam(':id', $id);
        $sentence->execute();
        return $sentence->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Elimina un producto por su ID.
     * 
     * @param int $id ID del producto a eliminar
     * @return bool Retorna true si se eliminó correctamente, false en caso contrario.
     */
    public function delete($id) {
        $query = "DELETE FROM {$this->table_name} WHERE id = :id";
        $sentence = $this->db_connection->prepare($query);
        $sentence->bindParam(':id', $id);
        return $sentence->execute();
    }
}
?>