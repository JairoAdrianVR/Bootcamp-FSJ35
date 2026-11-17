"use client";

import { useEffect, useMemo, useState } from "react";
import { menuService } from "@/features/menu/services/menu.service";
import type { MenuCategoria } from "@/features/menu/types";
import type { Plato } from "@/features/platos/types";
import { ApiError } from "@/shared/types/api";

function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(num) ? num.toFixed(2) : String(value);
}

export function MenuView() {
  const [categorias, setCategorias] = useState<MenuCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    menuService
      .categorias()
      .then((data) => {
        if (active) setCategorias(data);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof ApiError ? err.message : "No se pudo cargar el menu.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return categorias
      .filter((c) => (selected === null ? true : c.id === selected))
      .map((c) => ({
        ...c,
        platos: c.platos.filter((p) => {
          if (!p.disponible) return false;
          if (!term) return true;
          return (
            p.nombre.toLowerCase().includes(term) ||
            (p.descripcion ?? "").toLowerCase().includes(term)
          );
        }),
      }))
      .filter((c) => c.platos.length > 0);
  }, [categorias, search, selected]);

  const totalPlatos = useMemo(
    () => categorias.reduce((acc, c) => acc + c.platos.filter((p) => p.disponible).length, 0),
    [categorias],
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl space-y-4">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur">
              Carta del restaurante
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Nuestro menú</h1>
            <p className="text-lg text-white/90">
              Explora nuestras especialidades preparadas con ingredientes frescos. {totalPlatos} platos disponibles.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Search + filters */}
        <div className="mb-8 flex flex-col gap-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar plato..."
            className="w-full rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-zinc-800 dark:bg-zinc-900"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelected(null)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                selected === null
                  ? "bg-orange-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              Todos
            </button>
            {categorias.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  selected === c.id
                    ? "bg-orange-600 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                {c.nombre}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-zinc-500">Cargando menu...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-zinc-500">No se encontraron platos.</p>
        ) : (
          <div className="space-y-12">
            {filtered.map((categoria) => (
              <section key={categoria.id} className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">{categoria.nombre}</h2>
                    {categoria.descripcion ? (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{categoria.descripcion}</p>
                    ) : null}
                  </div>
                  <span className="text-xs font-medium text-zinc-400">
                    {categoria.platos.length} plato{categoria.platos.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {categoria.platos.map((plato) => (
                    <PlatoCard key={plato.id} plato={plato} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PlatoCard({ plato }: { plato: Plato }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative h-44 bg-gradient-to-br from-orange-100 via-amber-100 to-red-100 dark:from-orange-900/30 dark:via-amber-900/20 dark:to-red-900/30">
        <div className="absolute left-3 top-3 rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-orange-600 backdrop-blur dark:bg-zinc-900/80">
          {plato.categoria?.nombre ?? ""}
        </div>
      </div>
      <div className="space-y-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{plato.nombre}</h3>
          <span className="shrink-0 text-lg font-bold text-orange-600">{formatPrice(plato.precio)}</span>
        </div>
        {plato.descripcion ? (
          <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{plato.descripcion}</p>
        ) : null}
        {!plato.disponible ? (
          <span className="inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
            No disponible
          </span>
        ) : (
          <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Disponible
          </span>
        )}
      </div>
    </article>
  );
}
