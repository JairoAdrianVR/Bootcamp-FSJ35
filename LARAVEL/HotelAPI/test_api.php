<?php
// Script de prueba y verificación de salud de la API
// Ejecutar con: php test_api.php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

echo "=== DIAGNÓSTICO DE SALUD DE LA API ===\n";
$req = Illuminate\Http\Request::create('/api/v1/health', 'GET');
$res = $kernel->handle($req);
echo $res->getContent() . "\n";
