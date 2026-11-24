import type { Metadata } from 'next';
import { getLugares } from '@/lib/services/placesService';
import SearchAndFilter from '@/components/SearchAndFilter';
import SupabaseStatusBanner from '@/components/SupabaseStatusBanner';
import { CompassIcon } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Todos los Destinos Turísticos | El Salvador',
  description: 'Explora todos los lugares turísticos de El Salvador por departamento y categoría: playas, volcanes, lagos y pueblos coloniales.',
};

export default async function LugaresPage() {
  const { data: lugares, source, error } = await getLugares();

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <SupabaseStatusBanner source={source} error={error} />

      {/* Page Header */}
      <section className="bg-white border-b border-slate-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <CompassIcon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Directorio Nacional
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Destinos Turísticos de El Salvador
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Explora las maravillas naturales, tesoros arqueológicos y la cálida hospitalidad salvadoreña. Consulta en vivo desde nuestra base de datos en Supabase.
          </p>
        </div>
      </section>

      {/* Search & Grid Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <SearchAndFilter lugares={lugares} />
      </main>
    </div>
  );
}
