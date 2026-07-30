
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Practica MVC</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
</head>
<body class="bg-light">
    <?php include './views/layouts/navbar.php'?>

    <main class="container mt-2">
        <a href="./index.php?action=create" class="btn btn-success">Agregar estudiante</a>
        <table class="table m-2">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Descuento</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($products as $product) { ?>
                <tr scope="row">
                    <td><?php echo $product['id']; ?></td>
                    <td><?php echo $product['nombre']; ?></td>
                    <td><?php echo $product['precio']; ?></td>
                    <td><?php echo $product['descuento']; ?></td>
                    <td><?php echo $product['cantidad']; ?></td>
                    <td class="row">
                        <a class="btn btn-danger col-4 me-2" href="./index.php?action=delete&id=<?php echo $product['id']; ?>">Eliminar</a>
                        <a class="btn btn-primary col-4 " href="./index.php?action=update&id=<?php echo $product['id']; ?>">Editar</a>
                    </td>
                </tr>
                <?php } ?>
            </tbody>
        </table>
    </main>
</body>
</html>