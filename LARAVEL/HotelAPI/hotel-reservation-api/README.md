# Hotel Reservation & Decoupled Payment API 🏨💳

> **Descripción Académica y Profesional**:
> *"Desarrollar competencias en el modelado colaborativo de arquitecturas de software mediante UML, enfocándose en la correcta definición de contratos de API y la aplicación de principios de desacoplamiento en sistemas empresariales."*

---

## 🚀 Resumen del Proyecto

Esta solución implementa una **API REST Empresarial** para la gestión de reservas hoteleras y procesamiento desacoplado de pagos. Ha sido construida bajo el rol de **Full Stack Jr Expert**, priorizando la calidad del software, la arquitectura limpia (**Clean Architecture**), principios **SOLID** y el cumplimiento estricto de **Contratos de API**.

### 🌟 Funcionalidades Implementadas
1. 🔍 **Buscar habitaciones disponibles**: Búsqueda avanzada con validación matemática de no-traslape de fechas y filtros por hotel, ciudad, tipo y capacidad.
2. 📝 **Realizar reservas**: Creación transaccional atómica de reservas con cálculo automático de noches y tarifas, prevención de sobreventa (*double-booking*) y estado inicial `pending_payment`.
3. 💳 **Gestionar pagos**: Procesamiento desacoplado mediante el **Patrón Adapter / Gateway** (`PaymentGatewayInterface`), validación rigurosa de montos y transición de la reserva a `confirmed`.
4. 📄 **Recibir confirmaciones de reserva**: Emisión de vouchers oficiales de confirmación con desglose financiero, datos del huésped, hotel, habitación, recibo de pago y firma criptográfica de verificación.

### 🏛️ Usos y Entidades del Dominio
- **Cliente / Usuario (`User`)**: Huésped con datos de contacto, rol e historial de reservas.
- **Hotel (`Hotel`)**: Establecimiento, ubicación geográfica, categoría de estrellas y catálogo.
- **Habitación (`Room`)**: Unidades habitacionales tipificadas (single, double, suite, deluxe), capacidad y tarifa por noche.
- **Reserva (`Reservation`)**: Entidad relacional central que une al cliente con la habitación en un rango de fechas.
- **Pago (`Payment`)**: Registro transaccional financiero vinculado a la reserva y a la pasarela externa.

---

## 📐 Modelado UML Colaborativo

Todos los diagramas se encuentran documentados en formato PlantUML en `docs/uml/` y renderizables en Markdown en `docs/ARCHITECTURE.md`.

- **Diagrama de Casos de Uso (`docs/uml/use_case_diagram.puml`)**: Representa a los actores (*Cliente*, *Administrador*, *Pasarela Externa*) y las relaciones `<<include>>` en el flujo de reserva y cobro.
- **Diagrama de Clases (`docs/uml/class_diagram.puml`)**: Define el modelo del dominio, las interfaces de desacoplamiento (`RoomRepositoryInterface`, `ReservationServiceInterface`, `PaymentGatewayInterface`) y las realizaciones de infraestructura.
- **Diagrama de Secuencia (`docs/uml/sequence_diagram.puml`)**: Traza el flujo temporal paso a paso desde la búsqueda hasta la obtención del comprobante.

---

## 📜 Contratos de API (OpenAPI 3.0)

El contrato formal completo de la API se encuentra en [`docs/openapi.yaml`](docs/openapi.yaml).
Define con rigurosidad:
- Esquemas de petición y respuesta (JSON Schemas).
- Códigos de estado HTTP estandarizados (`200 OK`, `201 Created`, `404 Not Found`, `422 Unprocessable Content`).
- Formats, validaciones de fecha y tipos de datos fuertemente tipados.

---

## 🛠️ Principios de Desacoplamiento Empresarial

| Principio / Patrón | Implementación en el Código | Beneficio Empresarial |
| :--- | :--- | :--- |
| **Dependency Inversion (DIP)** | `HotelReservationServiceProvider` vincula las interfaces (`app/Contracts/`) con implementaciones (`app/Repositories/`, `app/Gateways/`). | Los servicios de negocio no dependen de Eloquent ni de librerías externas. |
| **Payment Gateway Adapter** | `PaymentGatewayInterface` y `MockPaymentGateway`. | Permite intercambiar proveedores de pago (Stripe, PayPal, MercadoPago) sin modificar el flujo de reservas. |
| **Data Transfer Objects (DTOs)** | `CreateReservationDTO`, `ProcessPaymentDTO`, `RoomSearchCriteriaDTO`. | Aísla la capa de negocio del objeto HTTP `Request` del framework. |
| **API Resources (Transformers)** | `ReservationConfirmationResource`, `RoomResource`, `PaymentResource`. | Desacopla el esquema de la base de datos del contrato expuesto a los clientes. |
| **Observer / Notification Decoupling** | `NotificationServiceInterface` y `LogNotificationService`. | Permite enviar confirmaciones por Email, SMS o Webhook sin impactar el tiempo de respuesta del pago. |

---

## 💻 Guía de Instalación y Ejecución

### 1. Clonar o acceder al proyecto
```bash
cd c:\xampp\htdocs\Bootcamp-FSJ35\Bootcamp-FSJ35\LARAVEL\hotel-reservation-api
```

### 2. Configuración de Entorno
Copiar el archivo de variables de entorno y generar la clave de aplicación:
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Migraciones y Seeders (Datos Demostrativos)
Ejecutar las migraciones y sembrar la base de datos con hoteles, habitaciones y reservas iniciales:
```bash
php artisan migrate --seed --seeder=HotelReservationSeeder
```

### 4. Ejecutar el Servidor de Desarrollo
```bash
php artisan serve
```
El servidor estará disponible en `http://localhost:8000`.

### 5. Ejecutar Pruebas Automatizadas
```bash
php artisan test --filter=HotelReservationWorkflowTest
```

---

## 📡 Ejemplos de Consumo de la API

### 1. Buscar Habitaciones Disponibles
```bash
curl -X GET "http://localhost:8000/api/v1/rooms/search?check_in_date=2026-12-01&check_out_date=2026-12-05&guests=2" \
     -H "Accept: application/json"
```

### 2. Realizar una Reserva
```bash
curl -X POST "http://localhost:8000/api/v1/reservations" \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{
       "user_id": 1,
       "room_id": 2,
       "check_in_date": "2026-12-10",
       "check_out_date": "2026-12-13",
       "guests_count": 2,
       "special_requests": "Piso alto con vista al jardín."
     }'
```

### 3. Gestionar y Procesar Pago
```bash
curl -X POST "http://localhost:8000/api/v1/payments" \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{
       "reservation_id": 1,
       "amount": 390.00,
       "payment_method": "credit_card",
       "token": "tok_visa_4242",
       "customer_email": "carlos.mendoza@example.com"
     }'
```

### 4. Recibir Confirmación de Reserva
```bash
curl -X GET "http://localhost:8000/api/v1/reservations/RES-DEMO-001/confirmation" \
     -H "Accept: application/json"
```
