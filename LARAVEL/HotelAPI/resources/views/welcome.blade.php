<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel Reservation & Decoupled Payment Enterprise API</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --bg: #0f172a;
            --card-bg: #1e293b;
            --card-border: #334155;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --success: #10b981;
            --danger: #ef4444;
            --accent: #f59e0b;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Figtree', system-ui, -apple-system, sans-serif;
            background: var(--bg);
            color: var(--text-main);
            min-height: 100vh;
            padding: 2rem 1rem;
        }
        .container { max-width: 1100px; margin: 0 auto; }
        header { text-align: center; margin-bottom: 2.5rem; }
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(16, 185, 129, 0.15);
            color: var(--success);
            border: 1px solid rgba(16, 185, 129, 0.3);
            padding: 0.35rem 0.85rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        .badge .dot { width: 8px; height: 8px; background: var(--success); border-radius: 50%; }
        h1 { font-size: 2.25rem; font-weight: 700; margin-bottom: 0.75rem; color: #fff; }
        p.subtitle { color: var(--text-muted); font-size: 1.05rem; max-width: 780px; margin: 0 auto; line-height: 1.6; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; }
        .card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 12px;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
        .card-icon {
            font-size: 1.5rem;
            background: rgba(37, 99, 235, 0.15);
            padding: 0.5rem;
            border-radius: 8px;
        }
        .card h3 { font-size: 1.15rem; font-weight: 600; }
        .card p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.5; }
        .method-badge {
            font-size: 0.75rem;
            font-weight: 700;
            padding: 0.2rem 0.45rem;
            border-radius: 4px;
            text-transform: uppercase;
        }
        .method-get { background: #0369a1; color: #e0f2fe; }
        .method-post { background: #15803d; color: #dcfce7; }
        
        .btn-group { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background: var(--primary);
            color: #fff;
            padding: 0.65rem 1rem;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 600;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: background 0.2s;
            flex: 1;
        }
        .btn:hover { background: var(--primary-dark); }
        .btn-danger { background: #b91c1c; }
        .btn-danger:hover { background: #991b1b; }
        .btn-outline { background: transparent; border: 1px solid var(--card-border); color: var(--text-main); }
        .btn-outline:hover { background: rgba(255,255,255,0.05); }

        .console-panel {
            background: #090d16;
            border: 1px solid var(--card-border);
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 2rem;
        }
        .console-header {
            background: #131c2e;
            padding: 0.75rem 1.25rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--card-border);
        }
        .console-header span { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
        pre#output {
            padding: 1.25rem;
            color: #38bdf8;
            font-family: monospace;
            font-size: 0.85rem;
            overflow-x: auto;
            max-height: 380px;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="badge">
                <span class="dot"></span>
                <span>API EN LÍNEA • LARAVEL 12</span>
            </div>
            <h1>Hotel Reservation & Decoupled Payment API</h1>
            <p class="subtitle">
                Arquitectura de software empresarial con desacoplamiento en capas, contratos OpenAPI 3.0,
                inversión de dependencias (DIP) y validación de disponibilidad sin sobreventa.
            </p>
        </header>

        <!-- Grilla de Endpoints Funcionales -->
        <div class="grid">
            <!-- 1. Buscar Habitaciones -->
            <div class="card">
                <div>
                    <div class="card-header">
                        <div class="card-icon">🔍</div>
                        <div>
                            <span class="method-badge method-get">GET</span>
                            <h3>Buscar Habitaciones</h3>
                        </div>
                    </div>
                    <p>Verifica disponibilidad matemática de fechas libres y filtra por hotel, tipo y capacidad.</p>
                </div>
                <button class="btn" onclick="testEndpoint('/api/v1/rooms/search?check_in_date=2026-12-01&check_out_date=2026-12-05&guests=2')">
                    Probar Disponibilidad
                </button>
            </div>

            <!-- 2. Realizar Reservas (Nuevo Comportamiento de Validación) -->
            <div class="card">
                <div>
                    <div class="card-header">
                        <div class="card-icon">📝</div>
                        <div>
                            <span class="method-badge method-post">POST</span>
                            <h3>Realizar Reservación</h3>
                        </div>
                    </div>
                    <p>Especifica <code>room_id</code> y <code>fecha</code>. Si está ocupada retorna <em>"Habitación ocupada en la fecha requerida"</em>; si está libre retorna <em>"Reservación completada"</em> con su ID.</p>
                </div>
                <div class="btn-group">
                    <button class="btn" onclick="testReservation(2, '2026-12-25')">
                        Probar Libre (Éxito)
                    </button>
                    <button class="btn btn-danger" onclick="testReservation(1, '2026-11-26')">
                        Probar Ocupada
                    </button>
                </div>
            </div>

            <!-- 3. Gestionar Pagos -->
            <div class="card">
                <div>
                    <div class="card-header">
                        <div class="card-icon">💳</div>
                        <div>
                            <span class="method-badge method-post">POST</span>
                            <h3>Gestionar Pagos</h3>
                        </div>
                    </div>
                    <p>Procesa pagos desacoplados mediante <code>PaymentGatewayInterface</code> y confirma reservas.</p>
                </div>
                <button class="btn" onclick="testPostPayment()">
                    Procesar Pago Demo
                </button>
            </div>

            <!-- 4. Recibir Confirmaciones -->
            <div class="card">
                <div>
                    <div class="card-header">
                        <div class="card-icon">📄</div>
                        <div>
                            <span class="method-badge method-get">GET</span>
                            <h3>Confirmación de Reserva</h3>
                        </div>
                    </div>
                    <p>Emite el comprobante y voucher oficial con desglose financiero, código y firma criptográfica.</p>
                </div>
                <button class="btn" onclick="testEndpoint('/api/v1/reservations/RES-CONF-001/confirmation')">
                    Ver Comprobante
                </button>
            </div>

            <!-- 5. Health Check & Diagnóstico -->
            <div class="card">
                <div>
                    <div class="card-header">
                        <div class="card-icon">🩺</div>
                        <div>
                            <span class="method-badge method-get">GET</span>
                            <h3>Health Check</h3>
                        </div>
                    </div>
                    <p>Diagnóstico de salud del sistema, conectividad de base de datos y total de registros.</p>
                </div>
                <button class="btn btn-outline" onclick="testEndpoint('/api/v1/health')">
                    Verificar Estado
                </button>
            </div>

            <!-- 6. Aprovisionar Datos (Seed) -->
            <div class="card">
                <div>
                    <div class="card-header">
                        <div class="card-icon">🌱</div>
                        <div>
                            <span class="method-badge method-post">POST</span>
                            <h3>Aprovisionar / Seed</h3>
                        </div>
                    </div>
                    <p>Siembra hoteles, habitaciones, clientes, reservas y comprobantes de confirmación.</p>
                </div>
                <button class="btn btn-outline" onclick="testSeed()">
                    Ejecutar Seeder
                </button>
            </div>
        </div>

        <!-- Consola de Resultados Interactiva -->
        <div class="console-panel">
            <div class="console-header">
                <span>CONSOLA DE RESPUESTA HTTP (CONTRATO JSON)</span>
                <span id="httpStatus" style="color: #10b981;">Listo</span>
            </div>
            <pre id="output">// Haz clic en cualquiera de los botones de arriba para probar los endpoints en vivo...</pre>
        </div>
    </div>

    <script>
        async function testEndpoint(url) {
            updateStatus('Cargando: ' + url + '...', '#f59e0b');
            try {
                const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
                const data = await res.json();
                document.getElementById('output').textContent = JSON.stringify(data, null, 2);
                updateStatus('HTTP ' + res.status + ' ' + (res.ok ? 'OK' : 'FAIL'), res.ok ? '#10b981' : '#ef4444');
            } catch (err) {
                document.getElementById('output').textContent = 'Error al consultar endpoint:\n' + err.message;
                updateStatus('Error de Red', '#ef4444');
            }
        }

        async function testReservation(roomId, fecha) {
            const url = '/api/v1/reservations';
            const payload = {
                room_id: roomId,
                fecha: fecha
            };
            sendPost(url, payload);
        }

        async function testPostPayment() {
            const url = '/api/v1/payments';
            const payload = {
                reservation_id: 1,
                amount: 390.00,
                payment_method: 'credit_card',
                token: 'tok_visa_4242',
                customer_email: 'carlos.mendoza@example.com'
            };
            sendPost(url, payload);
        }

        async function testSeed() {
            sendPost('/api/v1/setup/seed', {});
        }

        async function sendPost(url, payload) {
            updateStatus('POST ' + url + '...', '#f59e0b');
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                document.getElementById('output').textContent = JSON.stringify(data, null, 2);
                updateStatus('HTTP ' + res.status, res.ok ? '#10b981' : '#ef4444');
            } catch (err) {
                document.getElementById('output').textContent = 'Error:\n' + err.message;
                updateStatus('Error', '#ef4444');
            }
        }

        function updateStatus(text, color) {
            const el = document.getElementById('httpStatus');
            el.textContent = text;
            el.style.color = color;
        }

        window.addEventListener('DOMContentLoaded', () => {
            testEndpoint('/api/v1/health');
        });
    </script>
</body>
</html>
