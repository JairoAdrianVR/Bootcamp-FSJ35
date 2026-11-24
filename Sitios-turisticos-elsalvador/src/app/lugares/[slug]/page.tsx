import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getLugarBySlug, getLugaresByCategoria } from '@/lib/services/placesService';
import PlaceCard from '@/components/PlaceCard';
import SupabaseStatusBanner from '@/components/SupabaseStatusBanner';
import {
  MapPinIcon,
  StarIcon,
  DollarSignIcon,
  ThermometerIcon,
  ClockIcon,
  CompassIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
} from '@/components/Icons';

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Generación dinámica de Metadata para SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: lugar } = await getLugarBySlug(slug);

  if (!lugar) {
    return {
      title: 'Destino no encontrado | Turismo El Salvador',
    };
  }

  return {
    title: `${lugar.nombre} | Turismo El Salvador`,
    description: lugar.descripcion_corta,
    openGraph: {
      title: `${lugar.nombre} - ${lugar.departamento}`,
      description: lugar.descripcion_corta,
      images: [{ url: lugar.imagen_url }],
    },
  };
}

// RUTA DINÁMICA 1: Componente de Servidor para ver el detalle de un lugar turístico
export default async function LugarDetallePage({ params }: PageProps) {
  const { slug } = await params;
  const { data: lugar, source, error } = await getLugarBySlug(slug);

  if (!lugar) {
    notFound();
  }

  // Obtener lugares relacionados en la misma categoría
  const { data: relacionados } = await getLugaresByCategoria(lugar.categoria_slug);
  const otrosLugares = relacionados.filter((l) => l.slug !== lugar.slug).slice(0, 3);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Banner Supabase */}
      <SupabaseStatusBanner source={source} error={error} />

      {/* Breadcrumbs & Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <nav className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-sky-600 transition">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/lugares" className="hover:text-sky-600 transition">
              Lugares
            </Link>
            <span>/</span>
            <Link
              href={`/categorias/${lugar.categoria_slug}`}
              className="hover:text-sky-600 transition"
            >
              {lugar.categoria}
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-800 line-clamp-1">
              {lugar.nombre}
            </span>
          </nav>

          <Link
            href="/lugares"
            className="hidden sm:inline-flex items-center gap-1 font-semibold text-sky-600 hover:text-sky-700"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>Volver a lugares</span>
          </Link>
        </div>
      </div>

      {/* Hero Header with Place Image */}
      <div className="relative h-[45vh] sm:h-[55vh] lg:h-[60vh] w-full bg-slate-900">
        <Image
          src={lugar.imagen_url}
          alt={lugar.nombre}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-0 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 z-10 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Link
              href={`/categorias/${lugar.categoria_slug}`}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-600/90 hover:bg-sky-500 backdrop-blur-md text-white transition shadow-sm"
            >
              {lugar.categoria}
            </Link>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-md text-slate-100">
              {lugar.departamento}
            </span>
            <div className="flex items-center gap-1 bg-amber-500/90 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
              <StarIcon className="w-3.5 h-3.5 fill-current" />
              <span>{Number(lugar.rating).toFixed(1)} / 5.0</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-4xl">
            {lugar.nombre}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-3xl line-clamp-2">
            {lugar.descripcion_corta}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Descriptions, Details & Gallery */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Acerca de este destino
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {lugar.descripcion_completa}
              </p>

              {/* Actividades recomendadas */}
              {lugar.actividades && lugar.actividades.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider text-xs">
                    Actividades Populares
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {lugar.actividades.map((actividad, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200/60"
                      >
                        ✓ {actividad}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Photo Gallery */}
            {lugar.galeria && lugar.galeria.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Galería Fotográfica
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lugar.galeria.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 group shadow-xs"
                    >
                      <Image
                        src={imgUrl}
                        alt={`${lugar.nombre} - Foto ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Key Facts & Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs sticky top-20">
              <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                Información del Destino
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Departamento */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs">Ubicación y Departamento</span>
                    <span className="font-semibold text-slate-800">{lugar.ubicacion}</span>
                  </div>
                </div>

                {/* Clima */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <ThermometerIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs">Clima Promedio</span>
                    <span className="font-semibold text-slate-800">{lugar.clima}</span>
                  </div>
                </div>

                {/* Precio */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <DollarSignIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs">Precio de Entrada</span>
                    <span className="font-semibold text-slate-800">
                      {Number(lugar.precio_entrada) === 0
                        ? 'Acceso Gratuito'
                        : `$${Number(lugar.precio_entrada).toFixed(2)} USD por persona`}
                    </span>
                  </div>
                </div>

                {/* Horario */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs">Horario de Visita</span>
                    <span className="font-semibold text-slate-800">{lugar.horario}</span>
                  </div>
                </div>

                {/* Dificultad */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <CompassIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs">Nivel de Dificultad</span>
                    <span className="font-semibold text-slate-800">{lugar.dificultad}</span>
                  </div>
                </div>
              </div>

              {/* Technical Badge */}
              <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50 rounded-2xl p-3 text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Cargado dinámicamente vía Supabase SQL en Server Component.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Places in the same category */}
        {otrosLugares.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Otros destinos en {lugar.categoria}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Continúa descubriendo más maravillas en esta categoría.
                </p>
              </div>
              <Link
                href={`/categorias/${lugar.categoria_slug}`}
                className="text-xs sm:text-sm font-semibold text-sky-600 hover:text-sky-700"
              >
                Ver todos
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otrosLugares.map((otro) => (
                <PlaceCard key={otro.slug} lugar={otro} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
