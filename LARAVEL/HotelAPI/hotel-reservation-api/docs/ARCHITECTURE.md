# Arquitectura y Diseño del Sistema de Reservas de Hotel

> **Competencia**: Desarrollar competencias en el modelado colaborativo de arquitecturas de software mediante UML, enfocándose en la correcta definición de contratos de API y la aplicación de principios de desacoplamiento en sistemas empresariales.

---

## 1. Visión General de la Arquitectura

Para satisfacer las demandas de un entorno empresarial escalable, mantenible y testeable, se diseñó una **Arquitectura en Capas (Layered Clean Architecture)** que respeta los principios **SOLID**, especialmente el **Principio de Inversión de Dependencias (DIP)**.

```mermaid
flowchart TD
    Client["Cliente / Frontend"] -->|HTTP REST JSON| Controllers["Capa de Presentación (Controllers & FormRequests)"]
    Controllers -->|DTOs inmutables| Services["Capa de Dominio & Servicios (Business Logic)"]
    
    subgraph "Contratos y Abstracciones (Interfaces)"
        RoomRepoI["RoomRepositoryInterface"]
        ResRepoI["ReservationRepositoryInterface"]
        GatewayI["PaymentGatewayInterface"]
        NotifI["NotificationServiceInterface"]
    end
    
    Services --> RoomRepoI
    Services --> ResRepoI
    Services --> GatewayI
    Services --> NotifI
    
    subgraph "Implementaciones Concretas (Infraestructura)"
        EloquentRoom["EloquentRoomRepository"]
        EloquentRes["EloquentReservationRepository"]
        MockGateway["MockPaymentGateway (Stripe / PayPal Adapter)"]
        LogNotif["LogNotificationService"]
    end
    
    RoomRepoI -.-> EloquentRoom
    ResRepoI -.-> EloquentRes
    GatewayI -.-> MockGateway
    NotifI -.-> LogNotif
    
    EloquentRoom --> DB[("Base de Datos SQL")]
    EloquentRes --> DB
```

---

## 2. Principios de Desacoplamiento Aplicados

### A. Definición de Contratos de API (API Contracts)
- **Especificación OpenAPI 3.0**: La comunicación entre clientes y el backend se rige por un contrato explícito (`docs/openapi.yaml`), eliminando ambigüedades sobre tipos de datos, códigos HTTP (`200 OK`, `201 Created`, `422 Unprocessable Content`, `404 Not Found`) y estructuras de entrada/salida.
- **Form Requests**: La validación no se mezcla con la lógica de negocio; cada endpoint tiene un FormRequest especializado (`SearchRoomsRequest`, `StoreReservationRequest`, `ProcessPaymentRequest`).
- **API Resources**: Desacoplan la estructura de la base de datos de lo que el cliente consume en JSON. Si una columna cambia de nombre en la BD, el contrato público permanece inalterado.

### B. Inversión de Dependencias (DIP) y Contenedor IoC
- Las capas de alto nivel (`ReservationService`, `PaymentProcessingService`) **no dependen de implementaciones de bajo nivel** (como Eloquent o librerías de SDK de Stripe). Dependen exclusivamente de **interfaces (contratos)** ubicados en `app/Contracts/`.
- El enlace se realiza a través de `HotelReservationServiceProvider` en el Service Container de Laravel.

### C. Patrón Adapter / Gateway para Pagos
- El procesamiento de pagos implementa `PaymentGatewayInterface`.
- Permite cambiar de pasarela (Stripe, PayPal, MercadoPago o Mock) sin alterar una sola línea de código en la lógica de reservas.

### D. Data Transfer Objects (DTOs)
- La comunicación entre controladores y servicios se realiza mediante DTOs inmutables fuertemente tipados en PHP 8.2+ (`RoomSearchCriteriaDTO`, `CreateReservationDTO`, `ProcessPaymentDTO`, `PaymentResultDTO`).
- Evita que los servicios dependan del objeto HTTP `$request`.

---

## 3. Diagramas UML

### 3.1 Diagrama de Casos de Uso

```mermaid
flowchart LR
    Client(("Cliente / Usuario"))
    Admin(("Administrador de Hotel"))
    Gateway(("Pasarela de Pagos"))
    
    subgraph "Sistema de Reservas y Pagos"
        UC1(["Buscar habitaciones disponibles"])
        UC2(["Realizar reserva"])
        UC3(["Gestionar pagos"])
        UC4(["Recibir confirmaciones de reserva"])
        UC5(["Administrar catálogo de hoteles y habitaciones"])
    end
    
    Client --> UC1
    Client --> UC2
    Client --> UC3
    Client --> UC4
    
    UC3 -.->|Procesa cobro| Gateway
    Admin --> UC5
```

### 3.2 Diagrama de Clases del Dominio y Arquitectura

```mermaid
classDiagram
    class User {
        +int id
        +string name
        +string email
        +string phone
        +string identification_number
        +string role
    }

    class Hotel {
        +int id
        +string name
        +string address
        +string city
        +string country
        +int star_rating
    }

    class Room {
        +int id
        +int hotel_id
        +string room_number
        +string type
        +int capacity
        +float price_per_night
        +string status
    }

    class Reservation {
        +int id
        +string reservation_code
        +int user_id
        +int room_id
        +date check_in_date
        +date check_out_date
        +int nights_count
        +float total_amount
        +string status
    }

    class Payment {
        +int id
        +string payment_reference
        +int reservation_id
        +float amount
        +string payment_method
        +string status
        +string gateway_transaction_id
        +datetime paid_at
    }

    Hotel "1" --> "*" Room : contiene
    User "1" --> "*" Reservation : realiza
    Room "1" --> "*" Reservation : reservada
    Reservation "1" --> "0..1" Payment : liquidada_por
```

### 3.3 Diagrama de Secuencia: Reserva, Pago Desacoplado y Confirmación

```mermaid
sequenceDiagram
    autonumber
    actor Cliente
    participant RoomCtrl as RoomController
    participant ResCtrl as ReservationController
    participant PayCtrl as PaymentController
    participant ResService as ReservationService
    participant RoomRepo as RoomRepository
    participant PayService as PaymentProcessingService
    participant Gateway as PaymentGatewayInterface
    participant DB as Base de Datos

    %% Búsqueda
    Cliente->>RoomCtrl: GET /rooms/search (fechas, huéspedes)
    RoomCtrl->>RoomRepo: findAvailableRooms(CriteriaDTO)
    RoomRepo->>DB: Consulta habitaciones sin traslape
    DB-->>RoomRepo: Habitaciones libres
    RoomRepo-->>RoomCtrl: Resultados
    RoomCtrl-->>Cliente: 200 OK (Lista habitaciones)

    %% Reserva
    Cliente->>ResCtrl: POST /reservations (user, room, fechas)
    ResCtrl->>ResService: makeReservation(CreateReservationDTO)
    ResService->>RoomRepo: isRoomAvailableForDates()
    RoomRepo-->>ResService: Disponible (true)
    ResService->>DB: INSERT reservation (status='pending_payment')
    DB-->>ResService: Reservation Creada
    ResService-->>ResCtrl: Reserva
    ResCtrl-->>Cliente: 201 Created (Código de reserva)

    %% Pago
    Cliente->>PayCtrl: POST /payments (reserva_id, monto, metodo)
    PayCtrl->>PayService: processPayment(ProcessPaymentDTO)
    PayService->>Gateway: charge(ProcessPaymentDTO)
    Gateway-->>PayService: PaymentResultDTO(Success, txn_id)
    PayService->>DB: INSERT payment & UPDATE reservation (confirmed)
    PayService-->>PayCtrl: Pago Completado
    PayCtrl-->>Cliente: 201 Created (Pago y Reserva Confirmada)

    %% Confirmación
    Cliente->>ResCtrl: GET /reservations/{code}/confirmation
    ResCtrl->>ResService: getConfirmation(code)
    ResService->>DB: Carga relaciones (Hotel, Huésped, Habitación, Pago)
    DB-->>ResService: Entidades completas
    ResService-->>ResCtrl: Datos de confirmación
    ResCtrl-->>Cliente: 200 OK (Voucher con desglose y verificación digital)
```

---

## 4. Matriz de Endpoints y Casos de Uso

| Caso de Uso | Método HTTP | Endpoint | Contrato Request | Contrato Response |
| :--- | :--- | :--- | :--- | :--- |
| **Buscar habitaciones disponibles** | `GET` | `/api/v1/rooms/search` | Query params: `check_in_date`, `check_out_date`, `guests`, `hotel_id` | `200 OK`: `RoomResource[]` |
| **Realizar reservas** | `POST` | `/api/v1/reservations` | Body JSON: `user_id`, `room_id`, `check_in_date`, `check_out_date`, `guests_count` | `201 Created`: `ReservationResource` |
| **Gestionar pagos** | `POST` | `/api/v1/payments` | Body JSON: `reservation_id`, `amount`, `payment_method`, `token` | `201 Created`: `PaymentResource` |
| **Recibir confirmaciones de reserva** | `GET` | `/api/v1/reservations/{identifier}/confirmation` | Path param: ID o `reservation_code` | `200 OK`: `ReservationConfirmationResource` |
| **Consultar catálogo de hoteles** | `GET` | `/api/v1/hotels` | N/A | `200 OK`: `HotelResource[]` |
