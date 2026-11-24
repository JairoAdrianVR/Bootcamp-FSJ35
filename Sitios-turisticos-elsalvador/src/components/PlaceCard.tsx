import Link from 'next/link';
import Image from 'next/image';
import { LugarTuristico } from '@/types/place';
import { MapPinIcon, StarIcon, DollarSignIcon, ChevronRightIcon } from './Icons';

interface PlaceCardProps {
  lugar: LugarTuristico;
}

export default function PlaceCard({ lugar }: PlaceCardProps) {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Image container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={lugar.imagen_url}
          alt={lugar.nombre}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Link
            href={`/categorias/${lugar.categoria_slug}`}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 hover:bg-white text-slate-800 backdrop-blur-md shadow-xs transition"
          >
            {lugar.categoria}
          </Link>
          {lugar.destacado && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
              ★ Destacado
            </span>
          )}
        </div>

        {/* Rating badge */}
        <div className="absolute top-3 right-3 z-10 bg-slate-900/80 backdrop-blur-md text-amber-400 px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold shadow-xs">
          <StarIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>{Number(lugar.rating).toFixed(1)}</span>
        </div>

        {/* Department on image bottom */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 drop-shadow-md">
            <MapPinIcon className="w-4 h-4 text-sky-400" />
            <span className="font-medium">{lugar.departamento}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs text-[11px]">
            {lugar.dificultad}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1 mb-2">
          {lugar.nombre}
        </h3>
        
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 flex-grow">
          {lugar.descripcion_corta}
        </p>

        {/* Details row & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-auto">
          <div className="flex items-center gap-1 text-slate-700 font-medium">
            <DollarSignIcon className="w-4 h-4 text-emerald-600" />
            <span>
              {Number(lugar.precio_entrada) === 0
                ? 'Gratis / Sin costo'
                : `$${Number(lugar.precio_entrada).toFixed(2)} USD`}
            </span>
          </div>

          <Link
            href={`/lugares/${lugar.slug}`}
            className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-semibold text-xs group/btn"
          >
            <span>Ver detalles</span>
            <ChevronRightIcon className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
