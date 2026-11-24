import React from 'react';
import { CompassIcon } from '@/components/Icons';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 animate-pulse">
          <CompassIcon className="w-8 h-8 animate-spin" />
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 opacity-20 blur-sm animate-pulse" />
      </div>
      <h2 className="text-base font-bold text-slate-800 mb-1">
        Cargando destinos de El Salvador...
      </h2>
      <p className="text-xs text-slate-500 max-w-xs">
        Consultando servicios serverless de Supabase en tiempo real.
      </p>
    </div>
  );
}
