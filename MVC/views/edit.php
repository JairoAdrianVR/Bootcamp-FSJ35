<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Producto</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
</head>
<body>
    <?php include './views/layouts/navbar.php'?>
    <main class="container mt-2"> 
            <h2 class="text-center">Editar producto</h2>
        <section class="d-flex justify-content-center">
            <article class="card col-8" >
             <form class="form-control" action="./index.php?action=create" method="POST">
                <label class="form-label" for="">Nombre</label>
                <input class='form-control' type="text" name="nombre" value="<?php echo $product['nombre']?>">
                <label class="form-label" for="">Precio</label>
                <input class='form-control' type="number" name="precio" value="<?php echo $product['precio']?>">
                <label class="form-label" for="">Descuento</label>
                <input class='form-control' type="text" name="descuento" value="<?php echo $product['descuento']?>">
                <label class="form-label" for="">Cantidad</label>
                <input class="form-control" name="cantidad" value="<?php echo $product['cantidad']?>">
                <button class="btn btn-success mt-2" type="submit">Editar</button>
            </form>
            </article>
        </section>
    </main>


</body>
</html>