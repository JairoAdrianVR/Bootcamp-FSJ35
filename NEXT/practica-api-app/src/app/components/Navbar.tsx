import Link from 'next/link'; // Importamos el componente de navegación
export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-gray-800 p-4 rounded-xl mb-10 max-w-7xl mx-auto shadow-lg border border-gray-700">
        <h1 className="text-xl font-black text-white tracking-wider p-4">
          RICK Y MORTY
        </h1>
        
        <Link 
          href="/favoritos" 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>⭐️</span> Mis Favoritos
        </Link>
      </nav>
  )
}

