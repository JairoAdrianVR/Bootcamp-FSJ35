# AGENTS.md — Reglas del proyecto (System Prompt)

Este archivo define las reglas y convenciones que todo agente (y desarrollador) debe seguir al trabajar en **api-restaurante**, una API REST construida con **Laravel 12**.

## 1. Contexto del proyecto

- **Nombre:** api-restaurante
- **Tipo:** API REST (stateless) con autenticación por tokens (Laravel Sanctum).
- **Stack:** PHP 8.5, Laravel 12, Composer, MySQL (por defecto en desarrollo).
- **Rutas API:** `routes/api.php` (prefijo `/api`).
- **Autenticación:** Sanctum (`auth:sanctum`). Login de administrador en `POST /api/login` (AuthController). El modelo `User` usa el trait `HasApiTokens` y el campo `is_admin`.
- **Recursos:** Categorías, Platos, Pedidos (con items) y Usuarios administradores.
- **Idioma de comunicación:** español. Código, commits y nombres de variables en inglés (convención Laravel).

## 2. Principios generales

- Respetar la arquitectura y convenciones de Laravel 12. No reinventar patrones existentes.
- Preferir soluciones simples y legibles sobre abstracciones prematuras.
- No modificar archivos de `vendor/` ni de `bootstrap/cache/`.
- Mantener los cambios mínimos y enfocados en la tarea solicitada.
- Antes de crear código nuevo, verificar si ya existe algo similar en el proyecto.

## 3. Estructura y convenciones de código

- **Controladores:** en `app/Http/Controllers/Api/` (o `Api/V1/` si se versiona). Usar controladores de recursos (`--api`). Auth en `AuthController`.
- **Validación:** siempre mediante **Form Requests** en `app/Http/Requests/`. Nunca validar directamente en el controlador.
- **Respuestas:** usar **API Resources** (`app/Http/Resources/`) para serializar modelos. Responder JSON consistente.
- **Autorización:** middleware `admin` (`EnsureUserIsAdmin`) para rutas de gestión. Endpoints de pedidos/categorías/platos protegidos.
- **Modelos:** Eloquent. Definir `$fillable`, `$hidden`, casts y relaciones. Usar factories y seeders para datos de prueba.
- **Rutas:** registrar en `routes/api.php`. Agrupar por middleware y prefijo de versión cuando aplique (`/api/v1`).
- **Servicios/Dominio:** lógica de negocio compleja en `app/Services/` o `app/Actions/`, no en controladores.
- **Nombres:** controladores en PascalCase + `Controller`; modelos en singular PascalCase; tablas en snake_case plural.

## 4. Base de datos

- Usar migraciones para cualquier cambio de esquema. Nunca editar migraciones ya ejecutadas en producción; crear nuevas.
- Nombres de migración descriptivos. Índices y claves foráneas explícitos.
- Seeders y factories para datos de desarrollo/pruebas.
- No hardcodear datos en migraciones.

## 5. API y diseño REST

- Seguir convenciones REST: `GET /recurso`, `POST /recurso`, `GET /recurso/{id}`, `PUT/PATCH /recurso/{id}`, `DELETE /recurso/{id}`.
- Códigos HTTP correctos: 200, 201, 204, 400, 401, 403, 404, 422, 500.
- Errores de validación devuelven 422 con estructura JSON estándar de Laravel.
- Autenticación requerida en endpoints protegidos (`auth:sanctum`).
- Versionar la API cuando haya cambios incompatibles (`/api/v1`).

## 6. Seguridad

- Validar y sanitizar toda entrada del usuario.
- No exponer secretos ni credenciales en el código; usar `.env`.
- Usar políticas (`app/Policies/`) y gates para autorización.
- Proteger rutas sensibles con middleware adecuado.
- No registrar datos sensibles (passwords, tokens) en logs.

## 6.1 Manejo de errores (OBLIGATORIO)

- Todo controlador y autenticación debe tener manejo de errores (try/catch o handler global).
- Responder siempre en JSON con estructura consistente:
  - `{ "message": "..." }` para errores generales.
  - `{ "message": "...", "errors": { ... } }` para validación.
- Códigos HTTP correctos: 400, 401, 403, 404, 422, 409, 500.
- No exponer trazas/stack traces al cliente en producción.
- Registrar errores en logs (`Log::error`) con contexto.
- Validación de Form Requests se maneja automáticamente (422). Capturar `ModelNotFoundException` (404), `QueryException` (409/500) y excepciones genéricas (500).

## 7. Rendimiento

- Evitar N+1: usar `with()` / `load()` para eager loading.
- Paginar colecciones (`paginate()`), no devolver todo.
- Cachear consultas costosas cuando tenga sentido.

## 8. Calidad y pruebas

- Ejecutar `php artisan test` (o `vendor/bin/phpunit`) antes de considerar un cambio terminado.
- Escribir pruebas para endpoints nuevos y lógica de negocio.
- Formatear código con Laravel Pint: `vendor/bin/pint`.
- Análisis estático si está disponible (PHPStan/Larastan).

## 9. Comandos útiles

```powershell
php artisan serve
php artisan make:controller Api/RecursoController --api
php artisan make:model Recurso -mfs
php artisan make:request StoreRecursoRequest
php artisan make:resource RecursoResource
php artisan migrate
php artisan migrate:fresh --seed
php artisan test
vendor/bin/pint
```

## 10. Git

- Commits pequeños y descriptivos en inglés (conventional commits: `feat:`, `fix:`, `chore:`, `docs:`).
- Para generar los commits, solicitar el mensaje del commit. 
- No commitear `.env`, `vendor/`, `node_modules/` ni archivos de IDE.
- Revisar `git diff` antes de commitear.

## 11. Lo que NO hacer

- No desactivar CSRF/autenticación "para que funcione".
- No usar `DB::raw` con entrada de usuario sin sanitizar.
- No dejar `dd()`, `dump()` ni `ray()` en código de producción.
- No modificar el skeleton de Laravel sin justificación.
- No instalar paquetes sin verificar compatibilidad con Laravel 12.

---
**Última actualización:** definida por el equipo del proyecto. Mantener este archivo actualizado cuando cambien las convenciones.
