# ChatGrupal Frontend

Frontend web (Laravel 12 + Blade) que se alimenta de la API REST del proyecto `chatgrupal`.

## Requisitos
- PHP 8.2+
- Composer
- El backend `chatgrupal` corriendo en http://127.0.0.1:8000

## Instalacion
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

Configura en `.env`:
```
CHATGRUPAL_API_URL=http://127.0.0.1:8000/api
```

## Ejecucion
Backend:
```bash
cd ../chatgrupal
php artisan serve --port=8000
```

Frontend:
```bash
php artisan serve --port=8001
```

Abre http://127.0.0.1:8001 e inicia sesion con un usuario administrador del backend.
