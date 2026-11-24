import Link from 'next/link';
import { CompassIcon, ShieldCheckIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <CompassIcon className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white">El Salvador Turismo</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma turística desarrollada con Next.js 16 App Router, arquitectura serverless con Supabase PostgreSQL y políticas de seguridad RLS.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Destinos Populares
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/lugares/volcan-de-santa-ana" className="hover:text-sky-400 transition">
                  Volcán de Santa Ana
                </Link>
              </li>
              <li>
                <Link href="/lugares/lago-de-coatepeque" className="hover:text-sky-400 transition">
                  Lago de Coatepeque
                </Link>
              </li>
              <li>
                <Link href="/lugares/playa-el-tunco" className="hover:text-sky-400 transition">
                  Playa El Tunco (Surf City)
                </Link>
              </li>
              <li>
                <Link href="/lugares/concepcion-de-ataco" className="hover:text-sky-400 transition">
                  Ruta de las Flores (Ataco)
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Categorías
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/categorias/volcanes-y-montanas" className="hover:text-sky-400 transition">
                  Volcanes y Montañas
                </Link>
              </li>
              <li>
                <Link href="/categorias/playas-y-surf" className="hover:text-sky-400 transition">
                  Playas y Surf
                </Link>
              </li>
              <li>
                <Link href="/categorias/lagos-y-naturaleza" className="hover:text-sky-400 transition">
                  Lagos y Naturaleza
                </Link>
              </li>
              <li>
                <Link href="/categorias/pueblos-vivos-y-cultura" className="hover:text-sky-400 transition">
                  Pueblos Vivos y Cultura
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech stack badge */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Stack Tecnológico
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Next.js 16 App Router</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Supabase Database & Serverless</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Row Level Security (RLS)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Tailwind CSS Responsive</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Turismo de El Salvador. Proyecto académico Next.js 16 & Supabase.</p>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
            <span>RLS Configurado · Serverless Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
