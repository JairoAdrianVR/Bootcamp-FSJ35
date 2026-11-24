# 🌋 Turismo de El Salvador - Next.js 16 App Router & Supabase

Plataforma moderna y de alto rendimiento para la exploración y gestión de lugares turísticos de El Salvador (*"El Pulgarcito de América"*), construida con **Next.js 16+ (App Router)** y backend serverless impulsado por **Supabase (PostgreSQL)** con políticas estrictas de seguridad a nivel de fila (**Row Level Security - RLS**).

---

## 🚀 1. Tecnologías Obligatorias Implementadas

- **Next.js 16+**: Utilizando la arquitectura más moderna de **App Router** (`src/app`), React Server Components (RSC) y Streaming SSR.
- **Supabase**: Base de datos relacional PostgreSQL serverless para el almacenamiento y consulta en tiempo real de destinos turísticos.
- **Row Level Security (RLS)**: Políticas de seguridad activadas y configuradas para lectura pública (`SELECT`) y protección de inserción/edición.
- **TypeScript**: Tipado estricto de entidades (`LugarTuristico`, `CategoriaInfo`, esquema de base de datos).
- **Tailwind CSS**: Diseño responsivo para dispositivos móviles, tablets y escritorio.
- **Despliegue Serverless**: Optimizado para despliegue de producción en **Vercel**.

---

## 🗺️ 2. Rutas Dinámicas Implementadas

El proyecto implementa **2 rutas dinámicas** principales en componentes del servidor (Server Components):

| Ruta Dinámica | Propósito | Tipo de Componente | Origen de Datos |
| :--- | :--- | :--- | :--- |
| **`/lugares/[slug]`** | Muestra el detalle exhaustivo de un lugar turístico específico (Volcán de Santa Ana, El Tunco, etc.). | **Server Component** | Supabase (`.from('lugares_turisticos').eq('slug', slug)`) |
| **`/categorias/[slug]`** | Agrupa y lista todos los lugares que pertenecen a una categoría específica (Playas, Volcanes, Pueblos Vivos). | **Server Component** | Supabase (`.from('lugares_turisticos').eq('categoria_slug', slug)`) |

### Otras Rutas del Sistema:
- **`/` (Inicio)**: Hero interactivo, métricas en vivo, accesos rápidos a categorías, destinos destacados y buscador en tiempo real.
- **`/lugares`**: Catálogo completo nacional con búsqueda interactiva reactiva y filtros combinados por categoría y departamento.
- **`/categorias`**: Directorio visual de las experiencias y temáticas turísticas.

---

## 🗄️ 3. Estructura de Datos en Supabase (PostgreSQL & RLS)

El esquema y script SQL completo se encuentra en el archivo [`supabase/schema.sql`](file:///c:/xampp/htdocs/Bootcamp-FSJ35/Bootcamp-FSJ35/Sitios-turisticos-elsalvador/supabase/schema.sql).

### Tabla: `lugares_turisticos`
```sql
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
    rating NUMERIC(2, 1) NOT NULL DEFAULT 4.5,
    dificultad TEXT NOT NULL DEFAULT 'Fácil',
    ubicacion TEXT NOT NULL,
    destacado BOOLEAN NOT NULL DEFAULT false,
    horario TEXT NOT NULL DEFAULT 'Abierto todo el año',
    actividades TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### Configuración de Row Level Security (RLS)
La tabla tiene RLS activado obligatoriamente:
```sql
ALTER TABLE public.lugares_turisticos ENABLE ROW LEVEL SECURITY;

-- 1. Política de Lectura Pública (SELECT): Acceso para visitantes y Server Components
CREATE POLICY "Permitir lectura publica de destinos turisticos"
ON public.lugares_turisticos
FOR SELECT
TO public
USING (true);

-- 2. Políticas de Seguridad de Escritura (INSERT, UPDATE, DELETE): Restringido a usuarios autenticados
CREATE POLICY "Permitir insercion solo a usuarios autenticados"
ON public.lugares_turisticos
FOR INSERT
TO authenticated
WITH CHECK (true);
```

### Registros de Ejemplo Incluidos (8 Destinos Icónicos):
1. **Volcán de Santa Ana (Ilamatepec)** (*Santa Ana* - Volcanes y Montañas)
2. **Lago de Coatepeque** (*Santa Ana* - Lagos y Naturaleza)
3. **Playa El Tunco (Surf City)** (*La Libertad* - Playas y Surf)
4. **Joya de Cerén (Patrimonio Mundial UNESCO)** (*La Libertad* - Arqueología e Historia)
5. **Concepción de Ataco (Ruta de las Flores)** (*Ahuachapán* - Pueblos Vivos y Cultura)
6. **Parque Nacional El Imposible** (*Ahuachapán* - Lagos y Naturaleza)
7. **Suchitoto (Ciudad Colonial)** (*Cuscatlán* - Pueblos Vivos y Cultura)
8. **Playa El Sunzal** (*La Libertad* - Playas y Surf)

---

## ⚙️ 4. Guía de Configuración e Instalación Local

### Paso 1: Configurar Proyecto en Supabase
1. Ingresa a [supabase.com](https://supabase.com) y crea una cuenta o inicia sesión.
2. Crea un nuevo proyecto (ej. `turismo-el-salvador`).
3. Ve a la sección **SQL Editor** en la barra lateral izquierda.
4. Abre el archivo [`supabase/schema.sql`](file:///c:/xampp/htdocs/Bootcamp-FSJ35/Bootcamp-FSJ35/supabase/schema.sql), copia todo su contenido y pégalo en el editor SQL de Supabase.
5. Haz clic en **Run**. La tabla, índices, políticas RLS y los registros quedarán creados automáticamente.
6. Ve a **Project Settings -> API** y copia tu:
   - **Project URL**
   - **Project API Anon Key**

### Paso 2: Configurar Variables de Entorno
Crea o edita tu archivo `.env.local` en la raíz del proyecto:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

> **Nota de Resiliencia:** Si la aplicación se ejecuta sin variables de entorno o antes de vincular Supabase, activará automáticamente el modo de respaldo (*fallback*), mostrando los datos de muestra y un banner explicativo sin romper el renderizado.

### Paso 3: Instalar Dependencias y Ejecutar
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en http://localhost:3000
npm run dev

# Generar compilación optimizada para producción
npm run build
```

---

## ☁️ 5. Despliegue en Vercel

1. Sube este repositorio a tu cuenta de **GitHub**, **GitLab** o **Bitbucket**:
   ```bash
   git add .
   git commit -m "feat: proyecto Next.js 16 con rutas dinamicas y Supabase"
   git push origin main
   ```
2. Entra en [vercel.com](https://vercel.com) e inicia sesión.
3. Haz clic en **"Add New..." -> "Project"** e importa este repositorio.
4. En **Root Directory**, selecciona la carpeta `Sitios-turisticos-elsalvador` (o haz clic en "Edit" y selecciona esta carpeta).
5. En la sección **Environment Variables**, añade:
   - `NEXT_PUBLIC_SUPABASE_URL`: La URL de tu proyecto de Supabase.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Tu clave anónima (anon public key).
6. Haz clic en **Deploy**. Vercel compilará la aplicación y generará la URL de producción pública de forma instantánea.

---

## 🛡️ 6. Buenas Prácticas Aplicadas

- **Server Components**: Consultas a la base de datos realizadas del lado del servidor mediante el servicio [`placesService.ts`](file:///c:/xampp/htdocs/Bootcamp-FSJ35/Bootcamp-FSJ35/Sitios-turisticos-elsalvador/src/lib/services/placesService.ts), reduciendo el peso de JavaScript enviado al cliente.
- **Loading States**: Skeletons animados implementados en:
  - Global: [`src/app/loading.tsx`](file:///c:/xampp/htdocs/Bootcamp-FSJ35/Bootcamp-FSJ35/Sitios-turisticos-elsalvador/src/app/loading.tsx)
  - Lugares: [`src/app/lugares/[slug]/loading.tsx`](file:///c:/xampp/htdocs/Bootcamp-FSJ35/Bootcamp-FSJ35/Sitios-turisticos-elsalvador/src/app/lugares/[slug]/loading.tsx)
  - Categorías: [`src/app/categorias/[slug]/loading.tsx`](file:///c:/xampp/htdocs/Bootcamp-FSJ35/Bootcamp-FSJ35/Sitios-turisticos-elsalvador/src/app/categorias/[slug]/loading.tsx)
- **Manejo de Errores**: Error boundaries personalizados (`error.tsx`) y página no encontrado (`not-found.tsx`).
- **SEO Dinámico**: Implementación de `generateMetadata` en cada ruta dinámica para Open Graph y posicionamiento web.
