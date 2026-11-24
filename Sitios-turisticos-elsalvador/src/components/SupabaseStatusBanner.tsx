import React from 'react';
import { ShieldCheckIcon, SparklesIcon } from './Icons';

interface SupabaseStatusBannerProps {
  source: 'supabase' | 'fallback';
  error?: string | null;
}

export default function SupabaseStatusBanner({ source, error }: SupabaseStatusBannerProps) {
  if (source === 'supabase') {
    return (
      <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs sm:text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600 inline" />
            <span>Base de Datos Serverless Conectada en Vivo (Supabase PostgreSQL + RLS Activo)</span>
          </div>
          <span className="text-emerald-700 font-mono text-xs hidden sm:inline">Next.js 16 App Router · Server Component</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs sm:text-sm py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 font-medium">
          <SparklesIcon className="w-4 h-4 text-amber-600 inline flex-shrink-0" />
          <span>
            <strong>Modo Resiliente / Datos de Muestra:</strong> Configura tus variables <code className="bg-amber-100 px-1 py-0.5 rounded text-xs font-mono">NEXT_PUBLIC_SUPABASE_URL</code> y <code className="bg-amber-100 px-1 py-0.5 rounded text-xs font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> para sincronizar con tu base de datos Supabase.
          </span>
        </div>
        {error && (
          <span className="text-amber-700 text-xs italic">
            Nota: {error.length > 50 ? `${error.substring(0, 50)}...` : error}
          </span>
        )}
      </div>
    </div>
  );
}
