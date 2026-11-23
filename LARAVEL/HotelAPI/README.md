# HotelAPI 🏨💳

> **Competencia**:
> *"Desarrollar competencias en el modelado colaborativo de arquitecturas de software mediante UML, enfocándose en la correcta definición de contratos de API y la aplicación de principios de desacoplamiento en sistemas empresariales."*

---

## 🚀 Inicio Rápido

Para levantar el servidor de desarrollo:

```powershell
cd C:\xampp\htdocs\Bootcamp-FSJ35\Bootcamp-FSJ35\LARAVEL\HotelAPI
php artisan serve
```

Abre en tu navegador: **[http://localhost:8000](http://localhost:8000)** para acceder al **Dashboard Interactivo**.

---

## 📋 Endpoints Principales

| Función Requerida | Método | Endpoint |
| :--- | :---: | :--- |
| **Buscar habitaciones disponibles** | `GET` | `/api/v1/rooms/search?check_in_date=2026-12-01&check_out_date=2026-12-05&guests=2` |
| **Realizar reservas** | `POST` | `/api/v1/reservations` |
| **Gestionar pagos** | `POST` | `/api/v1/payments` |
| **Recibir confirmaciones de reserva** | `GET` | `/api/v1/reservations/RES-CONF-001/confirmation` |
| **Health Check del sistema** | `GET` | `/api/v1/health` |
| **Aprovisionamiento (Seed)** | `POST` | `/api/v1/setup/seed` |
| **Catálogo de Hoteles** | `GET` | `/api/v1/hotels` |
| **Catálogo de Habitaciones** | `GET` | `/api/v1/rooms` |
| **Clientes / Usuarios** | `GET` | `/api/v1/users` |
