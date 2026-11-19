"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/platos", label: "Platos" },
  { href: "/admin/pedidos", label: "Pedidos" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <p className="text-sm text-muted-foreground">Cargando panel...</p>
      </div>
    );
  }

  if (!user || !user.is_admin) return null;

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="flex">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background md:flex">
          <div className="flex h-16 items-center border-b border-border px-6">
            <span className="font-display text-lg tracking-tight">Restaurante</span>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {active ? <span className="h-1.5 w-1.5 rounded-full bg-accent" /> : <span className="h-1.5 w-1.5" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border p-4">
            <button
              onClick={logout}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
            <div>
              <h1 className="font-display text-lg tracking-tight">Panel de administración</h1>
              <p className="text-xs text-muted-foreground">Gestiona tu restaurante</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}