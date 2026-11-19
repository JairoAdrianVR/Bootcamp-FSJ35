"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { categoriasService } from "@/features/categorias/services/categorias.service";
import { platosService } from "@/features/platos/services/platos.service";
import { pedidosService } from "@/features/pedidos/services/pedidos.service";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function AdminDashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ categorias: 0, platos: 0, pedidos: 0 });

  useEffect(() => {
    let active = true;
    Promise.all([
      categoriasService.list(),
      platosService.list(),
      pedidosService.list(),
    ])
      .then(([c, p, pe]) => {
        if (active) {
          setCounts({
            categorias: c.meta.total,
            platos: p.meta.total,
            pedidos: pe.meta.total,
          });
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const cards = [
    { label: "Categorías", value: counts.categorias, href: "/admin/categorias" },
    { label: "Platos", value: counts.platos, href: "/admin/platos" },
    { label: "Pedidos", value: counts.pedidos, href: "/admin/pedidos" },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-background p-8">
        <p className="text-sm font-medium text-muted-foreground">Panel de control</p>
        <h2 className="mt-2 font-display text-3xl tracking-tight">
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
            className="group rounded-2xl border border-border bg-background p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-2 font-display text-4xl tracking-tight">{card.value}</p>
            <span className="mt-4 inline-block text-xs font-medium text-accent">
              Gestionar
            </span>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-background p-6">
        <h3 className="font-display text-xl tracking-tight">Accesos rápidos</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link href="/admin/categorias" className="rounded-lg border border-border px-4 py-3 text-sm font-medium transition hover:bg-muted">
            Gestionar categorías
          </Link>
          <Link href="/admin/platos" className="rounded-lg border border-border px-4 py-3 text-sm font-medium transition hover:bg-muted">
            Gestionar platos
          </Link>
          <Link href="/admin/pedidos" className="rounded-lg border border-border px-4 py-3 text-sm font-medium transition hover:bg-muted">
            Ver pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}