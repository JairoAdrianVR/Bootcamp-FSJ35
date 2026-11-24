-- ==============================================================================
-- SISTEMA DE TURISMO DE EL SALVADOR - ESQUEMA DE SUPABASE & RLS
-- ==============================================================================
-- Este script crea la tabla 'lugares_turisticos', habilita Row Level Security (RLS),
-- configura las políticas de acceso público de lectura y puebla con datos reales.
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Habilitar extensión para UUIDs (si no estuviese habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Eliminar la tabla si existe para reiniciar esquema limpiamente si se requiere
DROP TABLE IF EXISTS public.lugares_turisticos CASCADE;

-- 3. Crear tabla 'lugares_turisticos'
CREATE TABLE public.lugares_turisticos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    departamento TEXT NOT NULL,
    categoria TEXT NOT NULL,
    categoria_slug TEXT NOT NULL,
    descripcion_corta TEXT NOT NULL,
    descripcion_completa TEXT NOT NULL,
    imagen_url TEXT NOT NULL,
    galeria TEXT[] NOT NULL DEFAULT '{}',
    clima TEXT NOT NULL,
    precio_entrada NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    rating NUMERIC(2, 1) NOT NULL DEFAULT 4.5 CHECK (rating >= 1.0 AND rating <= 5.0),
    dificultad TEXT NOT NULL DEFAULT 'Fácil',
    ubicacion TEXT NOT NULL,
    destacado BOOLEAN NOT NULL DEFAULT false,
    horario TEXT NOT NULL DEFAULT 'Abierto todo el año',
    actividades TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Comentarios explicativos en la tabla y columnas
COMMENT ON TABLE public.lugares_turisticos IS 'Directorio de destinos turísticos destacados de El Salvador.';
COMMENT ON COLUMN public.lugares_turisticos.slug IS 'Identificador amigable para rutas dinámicas en Next.js App Router (/lugares/[slug]).';
COMMENT ON COLUMN public.lugares_turisticos.categoria_slug IS 'Identificador de categoría para rutas dinámicas (/categorias/[slug]).';

-- 4. Índices para optimización de consultas de lectura
CREATE INDEX idx_lugares_slug ON public.lugares_turisticos(slug);
CREATE INDEX idx_lugares_categoria_slug ON public.lugares_turisticos(categoria_slug);
CREATE INDEX idx_lugares_departamento ON public.lugares_turisticos(departamento);
CREATE INDEX idx_lugares_destacado ON public.lugares_turisticos(destacado);

-- ==============================================================================
-- 5. CONFIGURACIÓN DE SEGURIDAD A NIVEL DE FILA (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
-- Habilitar RLS de forma obligatoria en la tabla
ALTER TABLE public.lugares_turisticos ENABLE ROW LEVEL SECURITY;

-- Política 1: PERMITIR LECTURA PÚBLICA (SELECT)
-- Cualquier usuario (anónimo o autenticado) puede leer los lugares turísticos desde el servidor Next.js
CREATE POLICY "Permitir lectura publica de destinos turisticos"
ON public.lugares_turisticos
FOR SELECT
TO public
USING (true);

-- Política 2: PERMITIR INSERCIÓN SOLO A USUARIOS AUTENTICADOS (O Service Role)
CREATE POLICY "Permitir insercion solo a usuarios autenticados"
ON public.lugares_turisticos
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política 3: PERMITIR ACTUALIZACIÓN SOLO A USUARIOS AUTENTICADOS
CREATE POLICY "Permitir actualizacion solo a usuarios autenticados"
ON public.lugares_turisticos
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Política 4: PERMITIR ELIMINACIÓN SOLO A USUARIOS AUTENTICADOS
CREATE POLICY "Permitir eliminacion solo a usuarios autenticados"
ON public.lugares_turisticos
FOR DELETE
TO authenticated
USING (true);

-- ==============================================================================
-- 6. POBLADO DE LA TABLA (MÍNIMO 5 REGISTROS - INCLUIMOS 8 DESTINOS ICÓNICOS)
-- ==============================================================================

INSERT INTO public.lugares_turisticos (
    slug,
    nombre,
    departamento,
    categoria,
    categoria_slug,
    descripcion_corta,
    descripcion_completa,
    imagen_url,
    galeria,
    clima,
    precio_entrada,
    rating,
    dificultad,
    ubicacion,
    destacado,
    horario,
    actividades
) VALUES 
(
    'volcan-de-santa-ana',
    'Volcán de Santa Ana (Ilamatepec)',
    'Santa Ana',
    'Volcanes y Montañas',
    'volcanes-y-montanas',
    'El coloso más alto del país con una asombrosa laguna color esmeralda en su cráter.',
    'El Volcán de Ilamatepec es el volcán más imponente y alto de El Salvador, alcanzando los 2,381 metros sobre el nivel del mar. La caminata hacia la cima ofrece vistas panorámicas espectaculares del Lago de Coatepeque, el Volcán de Izalco y el Cerro Verde. Al coronar el cráter, los visitantes son recibidos por una impresionante laguna de azufre verde esmeralda y emanaciones de vapor que crean un paisaje extraterrestre inolvidable.',
    'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    ],
    'Fresco a Frío (10°C - 20°C)',
    3.00,
    4.9,
    'Moderada - Alta',
    'Parque Nacional Los Volcanes, Santa Ana',
    true,
    'Lunes a Domingo: 7:30 AM - 1:00 PM (ascensos guiados)',
    ARRAY['Hiking de alta montaña', 'Fotografía de paisajes', 'Avistamiento de aves', 'Senderismo botánico']
),
(
    'lago-de-coatepeque',
    'Lago de Coatepeque',
    'Santa Ana',
    'Lagos y Naturaleza',
    'lagos-y-naturaleza',
    'Espectacular espejo de agua volcánica que cambia misteriosamente a color turquesa.',
    'Considerado una de las maravillas naturales más hermosas del planeta, el Lago de Coatepeque se formó en la caldera de un antiguo volcán colapsado. Es famoso mundialmente porque sus aguas periódicamente experimentan una transformación biológica y geotérmica que tiñe el lago de un radiante color azul turquesa. Cuenta con excelentes restaurantes sobre muelles flotantes, paseos náuticos y villas panorámicas.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80'
    ],
    'Agradable Templado (22°C - 28°C)',
    0.00,
    4.8,
    'Fácil',
    'Cuenca de Coatepeque, El Congo, Santa Ana',
    true,
    'Acceso libre (Clubes y restaurantes: 8:00 AM - 8:00 PM)',
    ARRAY['Paseos en lancha y pontón', 'Kayak y paddleboard', 'Gastronomía de pescados y mariscos', 'Buceo recreativo']
),
(
    'playa-el-tunco',
    'Playa El Tunco (Surf City)',
    'La Libertad',
    'Playas y Surf',
    'playas-y-surf',
    'La meca internacional del surf salvadoreño con atardeceres dorados y vibrante vida bohemia.',
    'Ubicada a solo 35 minutos del Aeropuerto Internacional y de San Salvador, El Tunco es el corazón palpitante del circuito mundial Surf City. Su nombre proviene de una mítica formación rocosa en la orilla que simula la silueta de un cerdo. Es el destino favorito para surfistas novatos y profesionales de todo el mundo, con un ambiente cosmopolita repleto de cafés de especialidad, hostales ecológicos y gastronomía frente a las olas.',
    'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1200&q=80'
    ],
    'Cálido Tropical (26°C - 33°C)',
    0.00,
    4.7,
    'Fácil',
    'Km 42 Carretera El Litoral, Tamanique, La Libertad',
    true,
    'Abierto 24/7 (Restaurantes y bares: 8:00 AM - 11:00 PM)',
    ARRAY['Clases de Surf para todos los niveles', 'Yoga frente al mar', 'Tours de atardecer', 'Gastronomía local e internacional']
),
(
    'joya-de-ceren',
    'Joya de Cerén (Patrimonio Mundial UNESCO)',
    'La Libertad',
    'Arqueología e Historia',
    'arqueologia-e-historia',
    'La Pompeya de América: aldea maya preservada intacta bajo toneladas de ceniza volcánica.',
    'Declarado Patrimonio Cultural de la Humanidad por la UNESCO en 1993, Joya de Cerén es el sitio arqueológico más singular de Mesoamérica. A diferencia de las grandes pirámides ceremoniales de la élite maya, este sitio revela con asombroso detalle la vida cotidiana, cultivos, viviendas y rituales de los antiguos agricultores mayas del año 650 d.C., quienes evacuaron rápidamente tras la repentina erupción del volcán Loma Caldera.',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80'
    ],
    'Cálido Seco (24°C - 31°C)',
    1.00,
    4.8,
    'Fácil',
    'San Juan Opico, La Libertad',
    false,
    'Martes a Domingo: 9:00 AM - 4:00 PM',
    ARRAY['Recorrido guiado por estructuras originales', 'Museo de sitio interactivo', 'Fotografía histórica', 'Tienda de artesanías']
),
(
    'concepcion-de-ataco',
    'Concepción de Ataco (Ruta de las Flores)',
    'Ahuachapán',
    'Pueblos Vivos y Cultura',
    'pueblos-vivos-y-cultura',
    'Pueblo colonial entre cafetales, famoso por sus murales de fantasía y café gourmet.',
    'Anidado en la cordillera volcánica Apaneca-Ilamatepec, Concepción de Ataco es una joya colonial con calles empedradas y casonas de teja. Famoso internacionalmente por sus vibrantes murales pictóricos pintados en fachadas tradicionales, sus telares de palanca donde se confeccionan textiles artesanales, su aromático café de estricta altura y su animado festival gastronómico de fin de semana.',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80'
    ],
    'Fresco Montañoso (15°C - 23°C)',
    0.00,
    4.9,
    'Fácil',
    'Cordillera Apaneca, Departamento de Ahuachapán',
    true,
    'Abierto todo el año (Festivales: Sábados y Domingos)',
    ARRAY['Cata de café de exportación', 'Ruta de los murales fotográficos', 'Talleres de telares en madera', 'Mercado de artesanías']
),
(
    'parque-nacional-el-imposible',
    'Parque Nacional El Imposible',
    'Ahuachapán',
    'Lagos y Naturaleza',
    'lagos-y-naturaleza',
    'El bosque tropical húmedo y reserva ecológica con mayor biodiversidad de El Salvador.',
    'El Imposible es el parque ecológico protegido más extenso del país y un santuario vital para la biodiversidad centroamericana. Posee profundas gargantas rocosas, cañones, ríos cristalinos de montaña y cientos de especies de flora, aves migratorias, mariposas y mamíferos en peligro de extinción. Debe su nombre al histórico y arriesgado paso de cafetaleros sobre un abismo montañoso durante el siglo XIX.',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80'
    ],
    'Fresco Húmedo (18°C - 26°C)',
    3.00,
    4.9,
    'Alta',
    'San Francisco Menéndez, Ahuachapán',
    false,
    'Lunes a Domingo: 8:00 AM - 4:00 PM',
    ARRAY['Trekking por senderos y miradores', 'Avistamiento de aves exóticas', 'Baño en pozas de agua pura', 'Campamentos nocturnos guiados']
),
(
    'suchitoto',
    'Suchitoto (Pueblo Encantador y Colonial)',
    'Cuscatlán',
    'Pueblos Vivos y Cultura',
    'pueblos-vivos-y-cultura',
    'La capital cultural de El Salvador, cuna del arte, el añil colonial y vistas al lago Suchitlán.',
    'Suchitoto, cuyo nombre en náhuat significa "Lugar de pájaros y flores", es una joya detenida en el tiempo. Sus calles de piedra, balcones de hierro forjado, la majestuosa Iglesia Santa Lucía de 1853 y sus talleres ancestrales de tinte índigo (añil) enamoran a cada visitante. Además, colinda con el inmenso Lago Suchitlán, donde habitan garzas y pelícanos.',
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80'
    ],
    'Cálido Agradable (23°C - 30°C)',
    0.00,
    4.8,
    'Fácil',
    'Departamento de Cuscatlán',
    true,
    'Abierto todo el año',
    ARRAY['Paseos en lancha en Lago Suchitlán', 'Talleres de teñido en añil salvadoreño', 'Galerías de arte moderno y colonial', 'Cascada Los Tercios']
),
(
    'playa-el-sunzal',
    'Playa El Sunzal',
    'La Libertad',
    'Playas y Surf',
    'playas-y-surf',
    'Olas derechas legendarias reconocidas mundialmente y arrecifes para buceo.',
    'Playa El Sunzal es una de las joyas de Surf City El Salvador. Famosa por producir una de las olas más largas, consistentes y nobles del Océano Pacífico, idónea tanto para longboarders experimentados como para principiantes. Sus formaciones rocosas marinas albergan un arrecife vivo que atrae a entusiastas del esnórquel y buceo libre durante las mareas bajas.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1471922694854-ff1963b23e5e?auto=format&fit=crop&w=1200&q=80'
    ],
    'Cálido Costero (26°C - 33°C)',
    0.00,
    4.7,
    'Fácil',
    'Carretera El Litoral Km 44, La Libertad',
    false,
    'Abierto todo el año',
    ARRAY['Longboard y surf de olas derechas', 'Snorkel en arrecife de coral', 'Tours fotográficos de puesta de sol', 'Cenas románticas en acantilados']
);
