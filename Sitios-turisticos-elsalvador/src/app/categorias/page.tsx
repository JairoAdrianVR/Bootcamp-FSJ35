import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getCategorias } from '@/lib/services/placesService';
import {
  MountainIcon,
  WavesIcon,
  CompassIcon,
  LandmarkIcon,
  MapPinIcon,
  ChevronRightIcon,
} from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Categorías Turísticas | El Salvador',
  description: 'Explora El Salvador por temáticas: volcanes, playas de surf, lagos, pueblos vivos y sitios arqueológicos.',
};

export default async function CategoriasPage() {
  const categorias = await getCategorias();

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
    <div className="bg-slate-50 min-h-screen pb-16">
      <header className="bg-white border-b border-slate-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Exploración Temática
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            Categorías Turísticas
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Selecciona la experiencia que deseas vivir en El Salvador, desde las mejores olas del Pacífico hasta las alturas de la cordillera volcánica.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categorias/${cat.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1"
            >
              {/* Category Cover Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <Image
                  src={cat.imagen_url}
                  alt={cat.nombre}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4 z-10 w-11 h-11 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-md">
                  {getCategoryIcon(cat.slug)}
                </div>

                <div className="absolute bottom-3 right-4 z-10">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-900 backdrop-blur-md">
                    {cat.total_lugares} {cat.total_lugares === 1 ? 'destino' : 'destinos'}
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-2">
                  {cat.nombre}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed mb-6 flex-grow">
                  {cat.descripcion}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-600">
                  <span>Ver lugares de esta categoría</span>
                  <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
