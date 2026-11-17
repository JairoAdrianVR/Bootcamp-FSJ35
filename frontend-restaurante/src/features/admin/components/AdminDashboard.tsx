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
    { label: "Categorias", value: counts.categorias, href: "/admin/categorias", color: "from-amber-500 to-orange-500" },
    { label: "Platos", value: counts.platos, href: "/admin/platos", color: "from-orange-500 to-red-500" },
    { label: "Pedidos", value: counts.pedidos, href: "/admin/pedidos", color: "from-red-500 to-pink-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold">Hola, {user?.name ?? "admin"} 👋</h2>
        <p className="mt-1 text-white/90">
          Bienvenido al panel de administracion. Gestiona tu restaurante desde aqui.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div
              className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-2xl text-white shadow`}
            >
              {card.label.charAt(0)}
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{card.label}</p>
            <p className="text-3xl font-bold">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 font-semibold">Accesos rapidos</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/admin/categorias" className="rounded-lg bg-zinc-50 px-4 py-3 text-sm font-medium transition hover:bg-orange-50 dark:bg-zinc-800 dark:hover:bg-orange-900/20">
            Gestionar categorias
          </Link>
          <Link href="/admin/platos" className="rounded-lg bg-zinc-50 px-4 py-3 text-sm font-medium transition hover:bg-orange-50 dark:bg-zinc-800 dark:hover:bg-orange-900/20">
            Gestionar platos
          </Link>
          <Link href="/admin/pedidos" className="rounded-lg bg-zinc-50 px-4 py-3 text-sm font-medium transition hover:bg-orange-50 dark:bg-zinc-800 dark:hover:bg-orange-900/20">
            Ver pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}
