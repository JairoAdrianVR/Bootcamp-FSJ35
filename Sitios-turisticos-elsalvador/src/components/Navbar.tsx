import Link from 'next/link';
import { CompassIcon, MountainIcon, WavesIcon, LandmarkIcon } from './Icons';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <CompassIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-800 to-indigo-900 bg-clip-text text-transparent">
                El Salvador
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-sky-600 font-semibold -mt-1">
                Turismo & Rutas
              </span>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-sky-600 rounded-lg hover:bg-slate-100/60 transition"
            >
              Inicio
            </Link>
            <Link
              href="/lugares"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-sky-600 rounded-lg hover:bg-slate-100/60 transition"
            >
              Explorar Lugares
            </Link>
            <Link
              href="/categorias"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-sky-600 rounded-lg hover:bg-slate-100/60 transition"
            >
              Categorías
            </Link>
            <Link
              href="/categorias/playas-y-surf"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 rounded-lg hover:bg-slate-100/60 transition inline-flex items-center gap-1.5"
            >
              <WavesIcon className="w-4 h-4 text-sky-500" />
              Surf City
            </Link>
            <Link
              href="/categorias/volcanes-y-montanas"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 rounded-lg hover:bg-slate-100/60 transition inline-flex items-center gap-1.5"
            >
              <MountainIcon className="w-4 h-4 text-emerald-600" />
              Volcanes
            </Link>
          </nav>

          {/* Call to action */}
          <div className="flex items-center gap-3">
            <Link
              href="/lugares"
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-indigo-600 rounded-xl shadow-md shadow-sky-600/20 hover:from-sky-700 hover:to-indigo-700 transition"
            >
              Ver Destinos
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
