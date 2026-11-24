import Link from 'next/link';
import Image from 'next/image';
import { getLugares, getCategorias } from '@/lib/services/placesService';
import PlaceCard from '@/components/PlaceCard';
import SupabaseStatusBanner from '@/components/SupabaseStatusBanner';
import SearchAndFilter from '@/components/SearchAndFilter';
import {
  MountainIcon,
  WavesIcon,
  CompassIcon,
  LandmarkIcon,
  MapPinIcon,
  StarIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
} from '@/components/Icons';

// Server Component (Lectura desde base de datos Supabase en servidor)
export default async function HomePage() {
  const [lugaresResult, categorias] = await Promise.all([
    getLugares(),
    getCategorias(),
  ]);

  const { data: lugares, source, error } = lugaresResult;
  const destacados = lugares.filter((l) => l.destacado);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'volcanes-y-montanas':
        return <MountainIcon className="w-6 h-6 text-emerald-600" />;
      case 'playas-y-surf':
        return <WavesIcon className="w-6 h-6 text-sky-600" />;
      case 'lagos-y-naturaleza':
        return <CompassIcon className="w-6 h-6 text-teal-600" />;
      case 'pueblos-vivos-y-cultura':
        return <MapPinIcon className="w-6 h-6 text-amber-600" />;
      case 'arqueologia-e-historia':
        return <LandmarkIcon className="w-6 h-6 text-indigo-600" />;
      default:
        return <CompassIcon className="w-6 h-6 text-sky-600" />;
    }
  };

  return (
    <div>
      {/* Banner de estado de conexión a Supabase */}
      <SupabaseStatusBanner source={source} error={error} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-900 via-slate-900 to-slate-950 text-white py-20 lg:py-28">
        {/* Background decorative image with overlay */}
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
          <Image
            src="https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=2000&q=80"
            alt="El Salvador Volcanes"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-radial-at-c from-sky-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-6 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-pulse"></span>
              <span>Next.js 16 App Router · Supabase PostgreSQL</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Descubre la Magia de{' '}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                El Salvador
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed">
              Explora la tierra de volcanes activos, olas legendarias en Surf City, pueblos vivos de arquitectura colonial y vestigios arqueológicos mayas milenarios.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <Link
                href="/lugares"
                className="px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 shadow-lg shadow-sky-500/25 transition transform hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <span>Explorar Todos los Destinos</span>
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
              <Link
                href="/categorias"
                className="px-6 py-3.5 rounded-xl text-sm font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md transition"
              >
                Ver Categorías
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {lugares.length}+
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Destinos Registrados</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono">
                  {categorias.length}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Categorías Turísticas</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                  4.8★
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Calificación Promedio</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                  100%
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Serverless en Vercel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Horizontal Grid */}
      <section className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Explora por Categoría
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Ruta dinámica: Navega a <code className="text-sky-600 bg-sky-50 px-1 py-0.5 rounded">/categorias/[slug]</code>
              </p>
            </div>
            <Link
              href="/categorias"
              className="text-xs sm:text-sm font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categorias.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorias/${cat.slug}`}
                className="group p-4 rounded-2xl border border-slate-200/90 hover:border-sky-300 bg-slate-50/60 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs group-hover:scale-110 flex items-center justify-center mb-3 transition-transform border border-slate-100">
                  {getCategoryIcon(cat.slug)}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-1">
                  {cat.nombre}
                </h3>
                <span className="text-[11px] text-slate-500 mt-1">
                  {cat.total_lugares} {cat.total_lugares === 1 ? 'destino' : 'destinos'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Places (Destacados) */}
      {destacados.length > 0 && (
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                <StarIcon className="w-4 h-4 text-amber-500" />
                <span>Imperdibles de El Salvador</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Destinos Más Destacados
              </h2>
            </div>
            <Link
              href="/lugares"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700"
            >
              <span>Explorar catálogo completo</span>
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {destacados.map((lugar) => (
              <PlaceCard key={lugar.slug} lugar={lugar} />
            ))}
          </div>
        </section>
      )}

      {/* Search and Interactive Explorer Section */}
      <section className="py-14 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Catálogo de Destinos Turísticos
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Filtra por departamento, categoría o utiliza el buscador para planificar tu próxima aventura en tierras cuscatlecas.
            </p>
          </div>

          {/* Interactive Client Component for Search and Dynamic Filtering */}
          <SearchAndFilter lugares={lugares} />
        </div>
      </section>

      {/* Features & Architecture Highlights */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-sky-50/50 border border-sky-100">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-4">
                <CompassIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Rutas Dinámicas en Next.js
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Implementación de rutas anidadas dinámicas con parámetros en el App Router: <code className="text-sky-700 bg-sky-100/70 px-1 py-0.5 rounded">/lugares/[slug]</code> y <code className="text-sky-700 bg-sky-100/70 px-1 py-0.5 rounded">/categorias/[slug]</code>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Supabase & RLS Serverless
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lectura directa desde base de datos PostgreSQL en Server Components. Políticas de seguridad RLS configuradas para lectura pública y protección de escritura.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4">
                <StarIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Preparado para Despliegue
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Diseñado para despliegue de alta disponibilidad en Vercel, optimización de imágenes con next/image, estados de carga (loading states) y manejo de errores.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
