# AGENTS.md


## 1. Descripcion del proyecto
## Project

Laravel 12 application named `chatgrupal` (group chat). PHP 8.2+, Composer, SQLite by default.

## Working directory

Always run commands from the project root:

```
C:\xampp\htdocs\Bootcamp-FSJ35\chatgrupal
```

## Common commands

- Install dependencies: `composer install`
- Run dev server: `php artisan serve`
- Run tests: `php artisan test` (or `vendor/bin/phpunit`)
- Lint/format: `vendor/bin/pint`
- Migrations: `php artisan migrate`
- Fresh DB: `php artisan migrate:fresh --seed`
- Tinker: `php artisan tinker`

## Structure

- `app/` — application code (Models, Http/Controllers, etc.)
- `routes/` — web.php, api.php, console.php, channels.php
- `resources/` — views, css, js
- `database/` — migrations, factories, seeders
- `config/` — configuration
- `tests/` — Feature and Unit tests

## Conventions

- Follow PSR-12 and Laravel conventions; format with Pint before committing.
- Use Eloquent models and Form Requests for validation.
- Keep controllers thin; move business logic to services/actions.
- Write Feature tests for HTTP endpoints.
- Do not commit `.env` or `database/database.sqlite`.

## Notes

- Default DB is SQLite (`database/database.sqlite`).
- Real-time chat implemented with Laravel Reverb (event MessageSent, channel chat.{id}).



## 2. Principios generales

- Respetar la arquitectura y convenciones de Laravel 12. No reinventar patrones existentes.
- Preferir soluciones simples y legibles sobre abstracciones prematuras.
- No modificar archivos de `vendor/` ni de `bootstrap/cache/`.
- Mantener los cambios minimos y enfocados en la tarea solicitada.
- Antes de crear codigo nuevo, verificar si ya existe algo similar en el proyecto.

## 3. Estructura y convenciones de codigo

- **Controladores:** en `app/Http/Controllers/Api/`. Usar controladores de recursos (`--api`).
- **Validacion:** siempre mediante **Form Requests** en `app/Http/Requests/`. Nunca validar directamente en el controlador.
- **Respuestas:** JSON consistente con codigos HTTP apropiados.
- **Modelos:** Eloquent. Definir `$fillable`, casts y relaciones. Usar factories y seeders.
- **Rutas:** registrar en `routes/api.php`. Agrupar por middleware.
- **Nombres:** controladores en PascalCase + `Controller`; modelos en singular PascalCase; tablas en snake_case plural.

## 4. Base de datos

- Usar migraciones para cualquier cambio de esquema.
- Nombres de migracion descriptivos. Indices y claves foraneas explicitos.
- Seeders y factories para datos de desarrollo/pruebas.
- No hardcodear datos en migraciones.

Tablas: users (con is_admin), chats, messages, chat_user (pivot), profiles, personal_access_tokens.

## 5. API y diseno REST

- Seguir convenciones REST: `GET /recurso`, `POST /recurso`, `GET /recurso/{id}`, `PUT/PATCH /recurso/{id}`, `DELETE /recurso/{id}`.
- Codigos HTTP correctos: 200, 201, 204, 400, 401, 403, 404, 422, 500.
- Errores de validacion devuelven 422 con estructura JSON estandar de Laravel.
- Autenticacion requerida en endpoints protegidos (`auth:sanctum`). Enviar header `Accept: application/json`.
- Base URL de la API: `/api`.

## 6. Seguridad

- Validar y sanitizar toda entrada del usuario (Form Requests).
- No exponer secretos ni credenciales en el codigo; usar `.env`.
- Proteger rutas sensibles con middleware adecuado.
- No registrar datos sensibles (passwords, tokens) en logs.

## 7. Rendimiento

- Evitar N+1: usar `with()` / `load()` para eager loading.
- Paginar colecciones cuando sea necesario.

## 8. Calidad y pruebas

- Ejecutar `php artisan test` antes de considerar un cambio terminado.
- Formatear codigo con Laravel Pint: `vendor/bin/pint`.

## 9. Comandos utiles

```powershell
php artisan serve
php artisan migrate
php artisan migrate:fresh --seed
php artisan db:seed --class=AdminUserSeeder
php artisan test
vendor/bin/pint
```

## 10. Git

- Commits pequenos y descriptivos (conventional commits: `feat:`, `fix:`, `chore:`, `docs:`).
- No commitear `.env`, `vendor/`, `node_modules/` ni archivos de IDE.

## 11. Lo que NO hacer

- No desactivar CSRF/autenticacion "para que funcione".
- No usar `DB::raw` con entrada de usuario sin sanitizar.
- No dejar `dd()`, `dump()` ni `ray()` en codigo de produccion.
- No modificar el skeleton de Laravel sin justificacion.
- No instalar paquetes sin verificar compatibilidad con Laravel 12.

---
Ultima actualizacion: recursos de chats, mensajes, perfiles y login admin implementados.