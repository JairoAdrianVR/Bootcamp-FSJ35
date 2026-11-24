import Link from 'next/link';
import { CompassIcon, ArrowLeftIcon } from '@/components/Icons';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-lg">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
          <CompassIcon className="w-8 h-8" />
        </div>
        <span className="text-4xl font-extrabold text-sky-600 font-mono">404</span>
        <h2 className="text-xl font-bold text-slate-900 mt-2 mb-2">
          Destino no encontrado
        </h2>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          El lugar o categoría que buscas no existe o ha sido movido. ¡Explora los volcanes, playas y pueblos de El Salvador desde el inicio!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition shadow-sm"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>
      </div>
    </div>
  );
}
