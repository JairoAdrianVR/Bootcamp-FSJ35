"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { menuService } from "@/features/menu/services/menu.service";
import type { MenuCategoria } from "@/features/menu/types";
import type { Plato } from "@/features/platos/types";

function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(num) ? num.toFixed(2) : String(value);
}

export function HomeView() {
  const [categorias, setCategorias] = useState<MenuCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(2026);

  useEffect(() => {
    let active = true;
    menuService
      .categorias()
      .then((data) => {
        if (active) setCategorias(data);
      })
      .catch(() => {
        if (active) setCategorias([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    // Client-only value; update after mount to avoid prerender mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear(new Date().getFullYear());
  }, []);

  const destacados: Plato[] = categorias
    .flatMap((c) => c.platos)
    .filter((p) => p.disponible)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="max-w-2xl space-y-6">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur">
              Bienvenido a nuestro restaurante
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Sabores que enamoran, momentos que se recuerdan
            </h1>
            <p className="text-lg text-white/90">
              Disfruta de una cocina artesanal preparada con ingredientes frescos y de temporada.
              Reserva tu mesa o pide directamente desde nuestro menú.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-600 shadow-lg transition hover:bg-orange-50"
              >
                Ver menú
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Acceso admin
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Platos destacados</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Una selección de nuestras especialidades de la casa.
            </p>
          </div>
          <Link href="/menu" className="text-sm font-medium text-orange-600 hover:underline">
            Ver todos
          </Link>
        </div>
        {loading ? (
          <p className="text-sm text-zinc-500">Cargando destacados...</p>
        ) : destacados.length === 0 ? (
          <p className="text-sm text-zinc-500">Próximamente publicaremos nuestros platos.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((plato) => (
              <article
                key={plato.id}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="h-40 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30" />
                <div className="space-y-2 p-5">
                  <h3 className="font-semibold">{plato.nombre}</h3>
                  {plato.descripcion ? (
                    <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                      {plato.descripcion}
                    </p>
                  ) : null}
                  <p className="text-lg font-bold text-orange-600">{formatPrice(plato.precio)}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Categorias */}
      <section className="bg-zinc-50 py-16 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-8 text-2xl font-semibold sm:text-3xl">Nuestras categorías</h2>
          {categorias.length === 0 && !loading ? (
            <p className="text-sm text-zinc-500">Sin categorías disponibles.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categorias.map((categoria) => (
                <div
                  key={categoria.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <h3 className="font-semibold">{categoria.nombre}</h3>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {categoria.platos.length} plato{categoria.platos.length === 1 ? "" : "s"}
                  </p>
                  {categoria.descripcion ? (
                    <p className="mt-2 line-clamp-2 text-xs text-zinc-400">
                      {categoria.descripcion}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              title: "Ingredientes frescos",
              text: "Trabajamos con productores locales para garantizar la mejor calidad.",
            },
            {
              title: "Atención personalizada",
              text: "Nuestro equipo te acompaña en cada momento de tu visita.",
            },
            {
              title: "Pedidos al instante",
              text: "Gestiona tus comandas de forma rápida y sin complicaciones.",
            },
          ].map((f) => (
            <div key={f.title} className="space-y-2">
              <div className="text-3xl">✨</div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-600 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl space-y-4 px-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">¿Listo para disfrutar?</h2>
          <p className="text-white/90">Explora nuestro menú completo y haz tu pedido hoy mismo.</p>
          <Link
            href="/menu"
            className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
          >
            Ir al menú
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <p>© {year} Restaurante. Todos los derechos reservados.</p>
        <p className="mt-1">Calle Principal 123 · +34 600 000 000 · Lun-Dom 12:00-23:00</p>
      </footer>
    </div>
  );
}
