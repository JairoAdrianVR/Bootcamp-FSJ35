'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error detectado en la aplicación:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-100 shadow-xl text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Ha ocurrido un inconveniente
        </h2>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Ocurrió un error al procesar la solicitud en el servidor. Si estás configurando Supabase, verifica las credenciales de entorno y las políticas RLS.
        </p>

        {error.message && (
          <div className="mb-6 p-3 bg-slate-50 rounded-xl text-left border border-slate-200">
            <p className="text-[11px] font-mono text-slate-700 break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition shadow-sm"
          >
            Reintentar operación
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
          >
            Regresar al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
