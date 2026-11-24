'use client';

import React from 'react';
import Link from 'next/link';

export default function CategoriaError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-md">
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Error al cargar la categoría
        </h2>
        <p className="text-xs text-slate-600 mb-6">
          No pudimos conectar con Supabase para listar los destinos de esta categoría.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition"
          >
            Reintentar
          </button>
          <Link
            href="/categorias"
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
          >
            Ver todas las categorías
          </Link>
        </div>
      </div>
    </div>
  );
}
