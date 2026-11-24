import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Turismo El Salvador | Explora la Tierra de Volcanes y Surf City',
  description: 'Descubre los mejores destinos turísticos de El Salvador: volcanes, playas de surf, lagos turquesa, pueblos vivos coloniales y sitios arqueológicos mayas. Construido con Next.js 16 App Router y Supabase.',
  keywords: [
    'El Salvador',
    'Turismo El Salvador',
    'Surf City',
    'Volcán de Santa Ana',
    'Lago de Coatepeque',
    'Playa El Tunco',
    'Ruta de las Flores',
    'Suchitoto',
    'Next.js 16',
    'Supabase',
  ],
  authors: [{ name: 'Proyecto Estudiante Full Stack' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
