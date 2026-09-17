import Link from "next/link"; 

export default function Navbar() { 
  return ( 
    <nav className="w-full flex items-center justify-between border-b border-slate-700 bg-slate-800 px-6 py-4 shadow-lg"> 
      <Link 
        href="/"
        className="text-xl font-black tracking-wider text-white shrink-0" 
      > 
        RICK Y MORTY 
      </Link> 

      <div className="flex items-center gap-3"> 
        <Link 
          href="/" 
          className="rounded-lg px-4 py-2 font-semibold text-slate-200 transition hover:bg-slate-700" 
        > 
          Inicio 
        </Link> 
        <Link 
          href="/favoritos"
          className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-bold text-slate-950 transition hover:bg-green-400" 
        > 
          <span aria-hidden="true">⭐️</span>
          Mis favoritos 
        </Link> 
      </div> 
    </nav> 
  );
}