import './globals.css';
import { AuthProvider } from './context/AuthContext';

export const metadata = {
  title: 'Laravel Sanctum + Next.js',
  description: 'CRUD Posts con autenticación',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        <AuthProvider>
          <main className="max-w-4xl mx-auto p-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
