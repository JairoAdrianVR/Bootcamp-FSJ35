"use client";

import { useMenuCategorias } from "@/features/menu/hooks/useMenuCategorias";
import { useMenuFiltros } from "@/features/menu/hooks/useMenuFiltros";
import { formatPrice, resolveImage } from "@/features/menu/utils/format";
import type { Plato } from "@/features/platos";

export function MenuView() {
  const { categorias, loading, error } = useMenuCategorias();
  const { search, setSearch, selected, setSelected, filtered, totalPlatos } =
    useMenuFiltros(categorias);

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
            aria-label="Buscar plato o ingrediente"
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
          <p className="text-sm font-medium text-foreground">{error}</p>
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
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
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
            <span className="text-xs font-medium text-foreground">No disponible</span>
          )}
        </div>
      </div>
    </article>
  );
}