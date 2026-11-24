import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getLugaresByCategoria, getCategorias } from '@/lib/services/placesService';
import PlaceCard from '@/components/PlaceCard';
import SupabaseStatusBanner from '@/components/SupabaseStatusBanner';
import {
  MountainIcon,
  WavesIcon,
  CompassIcon,
  LandmarkIcon,
  MapPinIcon,
  ArrowLeftIcon,
} from '@/components/Icons';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categorias = await getCategorias();
  const categoria = categorias.find((c) => c.slug === slug);

  if (!categoria) {
    return {
      title: 'Categoría no encontrada | Turismo El Salvador',
    };
  }

  return {
    title: `${categoria.nombre} | Turismo El Salvador`,
    description: categoria.descripcion,
  };
}

// RUTA DINÁMICA 2: Lugares filtrados por categoría en Server Component
export default async function CategoriaDetallePage({ params }: PageProps) {
  const { slug } = await params;
  const [lugaresResult, categorias] = await Promise.all([
    getLugaresByCategoria(slug),
    getCategorias(),
  ]);

  const { data: lugares, source, error } = lugaresResult;
  const categoriaActual = categorias.find((c) => c.slug === slug);

  if (!categoriaActual && lugares.length === 0) {
    notFound();
  }

  const nombreCategoria = categoriaActual ? categoriaActual.nombre : slug.replace(/-/g, ' ');
  const descripcionCategoria = categoriaActual
    ? categoriaActual.descripcion
    : `Destinos turísticos pertenecientes a la categoría ${nombreCategoria}.`;

  const getCategoryIcon = (s: string) => {
    switch (s) {
      case 'volcanes-y-montanas':
        return <MountainIcon className="w-8 h-8 text-emerald-600" />;
      case 'playas-y-surf':
        return <WavesIcon className="w-8 h-8 text-sky-600" />;
      case 'lagos-y-naturaleza':
        return <CompassIcon className="w-8 h-8 text-teal-600" />;
      case 'pueblos-vivos-y-cultura':
        return <MapPinIcon className="w-8 h-8 text-amber-600" />;
      case 'arqueologia-e-historia':
        return <LandmarkIcon className="w-8 h-8 text-indigo-600" />;
      default:
        return <CompassIcon className="w-8 h-8 text-sky-600" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <SupabaseStatusBanner source={source} error={error} />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <nav className="flex items-center gap-1.5">
            <Link href="/" className="hover:text-sky-600 transition">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/categorias" className="hover:text-sky-600 transition">
              Categorías
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">{nombreCategoria}</span>
          </nav>

          <Link
            href="/categorias"
            className="inline-flex items-center gap-1 font-semibold text-sky-600 hover:text-sky-700"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>Todas las categorías</span>
          </Link>
        </div>
      </div>

      {/* Category Hero Header */}
      <header className="bg-white border-b border-slate-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0 shadow-xs">
              {getCategoryIcon(slug)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  Categoría Turística
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800">
                  {lugares.length} {lugares.length === 1 ? 'destino' : 'destinos'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {nombreCategoria}
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-slate-600 max-w-2xl">
                {descripcionCategoria}
              </p>
            </div>
          </div>

          {/* Quick switcher to other categories */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs text-slate-400 font-medium flex-shrink-0">Otras categorías:</span>
            {categorias
              .filter((c) => c.slug !== slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/categorias/${c.slug}`}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 whitespace-nowrap transition"
                >
                  {c.nombre}
                </Link>
              ))}
          </div>
        </div>
      </header>

      {/* Main Grid of Places */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {lugares.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lugares.map((lugar) => (
              <PlaceCard key={lugar.slug} lugar={lugar} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-2">
              No hay destinos en esta categoría todavía
            </h3>
            <p className="text-xs text-slate-500 mb-6 max-w-md mx-auto">
              Puedes agregar nuevos destinos a esta categoría insertando registros en la tabla <code className="bg-slate-100 px-1 py-0.5 rounded">lugares_turisticos</code> de Supabase.
            </p>
            <Link
              href="/lugares"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition"
            >
              Explorar todos los lugares
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
