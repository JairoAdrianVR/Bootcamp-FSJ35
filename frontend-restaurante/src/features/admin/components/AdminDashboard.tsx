"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth";
import { useAdminResumen } from "@/features/admin/hooks/useAdminResumen";

export function AdminDashboard() {
  const { user } = useAuth();
  const { categorias, platos, pedidos, loading, error } = useAdminResumen();

  const cards = [
    { label: "Categorías", value: categorias, href: "/admin/categorias" },
    { label: "Platos", value: platos, href: "/admin/platos" },
    { label: "Pedidos", value: pedidos, href: "/admin/pedidos" },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-background p-8">
        <p className="text-sm font-medium text-muted-foreground">Panel de control</p>
        <h2 className="mt-2 font-display text-3xl tracking-tight text-foreground">
          Hola, {user?.name ?? "administrador"}
        </h2>
        <p className="mt-2 text-muted-foreground">
          Gestiona el restaurante: categorías, platos y pedidos desde aquí.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-2xl border border-border bg-background p-6 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-2 font-display text-4xl tracking-tight text-foreground">
              {loading ? "…" : card.value}
            </p>
            <span className="mt-4 inline-block text-xs font-medium text-accent">
              Gestionar
            </span>
          </Link>
        ))}
      </div>

      {error ? (
        <p
          aria-live="polite"
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground"
        >
          {error}
        </p>
      ) : null}

      <div className="rounded-2xl border border-border bg-background p-6">
        <h3 className="font-display text-xl tracking-tight text-foreground">
          Accesos rápidos
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link
            href="/admin/categorias"
            className="rounded-lg border border-border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:bg-muted"
          >
            Gestionar categorías
          </Link>
          <Link
            href="/admin/platos"
            className="rounded-lg border border-border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:bg-muted"
          >
            Gestionar platos
          </Link>
          <Link
            href="/admin/pedidos"
            className="rounded-lg border border-border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:bg-muted"
          >
            Ver pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}
