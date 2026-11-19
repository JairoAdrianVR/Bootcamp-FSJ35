"use client";

import { useEffect, useMemo, useState } from "react";
import { menuService } from "@/features/menu/services/menu.service";
import type { MenuCategoria } from "@/features/menu/types";
import type { Plato } from "@/features/platos/types";
import { ApiError } from "@/shared/types/api";

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api").replace(/\/api\/?$/, "");

function resolveImage(src: string | null): string | null {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  const path = src.startsWith("/") ? src : `/${src}`;
  return `${API_ORIGIN}${path}`;
}

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
          setError(err instanceof ApiError ? err.message : "No se pudo cargar el menú.");
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
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-sm font-medium text-muted-foreground">Carta del restaurante</p>
          <h1 className="mt-2 font-display text-5xl tracking-tight sm:text-6xl">Nuestro menú</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Explora nuestras especialidades preparadas con ingredientes frescos. {totalPlatos} platos disponibles.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Search + filters */}
        <div className="mb-10 flex flex-col gap-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar plato o ingrediente"
            className="w-full rounded-xl border border-border bg-background px-5 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <div className="flex flex-wrap gap-2">
            <FilterPill active={selected === null} onClick={() => setSelected(null)}>
              Todos
            </FilterPill>
            {categorias.map((c) => (
              <FilterPill key={c.id} active={selected === c.id} onClick={() => setSelected(c.id)}>
                {c.nombre}
              </FilterPill>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando menú...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No se encontraron platos.</p>
        ) : (
          <div className="space-y-16">
            {filtered.map((categoria) => (
              <section key={categoria.id} className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <h2 className="font-display text-3xl tracking-tight">{categoria.nombre}</h2>
                    {categoria.descripcion ? (
                      <p className="mt-1 text-sm text-muted-foreground">{categoria.descripcion}</p>
                    ) : null}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
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

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-accent text-accent-foreground"
          : "bg-muted text-foreground hover:bg-border"
      }`}
    >
      {children}
    </button>
  );
}

function PlatoCard({ plato }: { plato: Plato }) {
  const img = resolveImage(plato.imagen);
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-background transition hover:-translate-y-1 hover:shadow-lg">
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt={plato.nombre}
          className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted">
          <span className="font-display text-3xl text-muted-foreground">{plato.nombre.charAt(0)}</span>
        </div>
      )}
      <div className="space-y-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg tracking-tight leading-tight">{plato.nombre}</h3>
          <span className="shrink-0 font-display text-lg text-accent">{formatPrice(plato.precio)}</span>
        </div>
        {plato.descripcion ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{plato.descripcion}</p>
        ) : null}
        <div className="pt-1">
          {plato.disponible ? (
            <span className="text-xs font-medium text-accent">Disponible</span>
          ) : (
            <span className="text-xs font-medium text-red-600">No disponible</span>
          )}
        </div>
      </div>
    </article>
  );
}