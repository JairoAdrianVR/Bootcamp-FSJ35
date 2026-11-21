"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMenuCategorias } from "@/features/menu/hooks/useMenuCategorias";
import { formatPrice, getPlatosDestacados, resolveImage } from "@/features/menu/utils/format";

const features = [
  {
    title: "Ingredientes de temporada",
    text: "Trabajamos con productores locales y cocinamos lo que el tiempo ofrece.",
  },
  {
    title: "Servicio cercano",
    text: "Nuestro equipo te acompaña en cada momento de la visita.",
  },
  {
    title: "Pedido sin esperas",
    text: "Gestiona tu comanda desde la mesa de forma rápida y sencilla.",
  },
];

export function HomeView() {
  const { categorias, loading, error } = useMenuCategorias();
  const [year, setYear] = useState(2026);

  useEffect(() => {
    // Client-only value; update after mount to avoid prerender mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear(new Date().getFullYear());
  }, []);

  const destacados = getPlatosDestacados(categorias);

  const heroImage =
    destacados.map((plato) => resolveImage(plato.imagen)).find((src) => src !== null) ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="space-y-8">
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl reveal">
              Cocina de temporada, servida con calma
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground reveal reveal-delay-1">
              Platos artesanales preparados con ingredientes frescos del mercado. Reserva tu mesa
              o pide directamente desde el menú.
            </p>
            <div className="flex flex-wrap gap-3 reveal reveal-delay-2">
              <Link
                href="/menu"
                className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Explorar el menú
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Acceso administración
              </Link>
            </div>
          </div>
          <div className="reveal reveal-delay-2">
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage}
                alt="Plato destacado de la casa"
                className="aspect-[4/5] w-full rounded-3xl object-cover shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]"
              />
            ) : (
              <div className="flex aspect-[4/5] w-full items-center justify-center rounded-3xl bg-muted text-muted-foreground">
                <span className="font-display text-2xl">Nuestra cocina</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Platos destacados</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Una selección de nuestras especialidades de la casa.
            </p>
          </div>
          <Link href="/menu" className="text-sm font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            Ver todos
          </Link>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando destacados...</p>
        ) : error ? (
          <p className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground">
            {error}
          </p>
        ) : destacados.length === 0 ? (
          <p className="text-sm text-muted-foreground">Próximamente publicaremos nuestros platos.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((plato) => {
              const img = resolveImage(plato.imagen);
              return (
                <article
                  key={plato.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-background transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img}
                      alt={plato.nombre}
                      className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted text-muted-foreground">
                      <span className="font-display text-xl">{plato.nombre.charAt(0)}</span>
                    </div>
                  )}
                  <div className="space-y-2 p-5">
                    <h3 className="font-display text-lg tracking-tight">{plato.nombre}</h3>
                    {plato.descripcion ? (
                      <p className="line-clamp-2 text-sm text-muted-foreground">{plato.descripcion}</p>
                    ) : null}
                    <p className="text-lg font-semibold text-accent">{formatPrice(plato.precio)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Categorias */}
      <section className="bg-muted/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Nuestras categorías</h2>
          {error ? (
            <p className="mt-4 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground">
              {error}
            </p>
          ) : categorias.length === 0 && !loading ? (
            <p className="mt-4 text-sm text-muted-foreground">Sin categorías disponibles.</p>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categorias.map((categoria) => (
                <div
                  key={categoria.id}
                  className="rounded-2xl border-l-2 border-accent bg-background p-5 transition hover:bg-muted"
                >
                  <h3 className="font-display text-lg tracking-tight">{categoria.nombre}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {categoria.platos.length} plato{categoria.platos.length === 1 ? "" : "s"}
                  </p>
                  {categoria.descripcion ? (
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{categoria.descripcion}</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="space-y-3">
              <span className="inline-block h-px w-10 bg-accent" aria-hidden />
              <h3 className="font-display text-xl tracking-tight">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent py-20 text-accent-foreground">
        <div className="mx-auto max-w-2xl space-y-5 px-6 text-center">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">¿Listo para disfrutar?</h2>
          <p className="text-accent-foreground/85">Explora nuestro menú completo y haz tu pedido hoy mismo.</p>
          <Link
            href="/menu"
            className="inline-flex items-center rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Ir al menú
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© {year} Restaurante. Todos los derechos reservados.</p>
        <p className="mt-1">Calle Principal 123 · +34 600 000 000 · Lun-Dom 12:00-23:00</p>
      </footer>
    </div>
  );
}