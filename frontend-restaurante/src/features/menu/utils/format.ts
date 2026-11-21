import type { MenuCategoria } from "@/features/menu/types";
import type { Plato } from "@/features/platos";

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api").replace(
  /\/api\/?$/,
  "",
);

/** Convierte una ruta de imagen relativa del backend en URL absoluta. */
export function resolveImage(src: string | null): string | null {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  const path = src.startsWith("/") ? src : `/${src}`;
  return `${API_ORIGIN}${path}`;
}

/** Formatea un precio (number o string numérico) con dos decimales. */
export function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(num) ? num.toFixed(2) : String(value);
}

/** Platos disponibles a destacar en la home, aplanados desde las categorías. */
export function getPlatosDestacados(categorias: MenuCategoria[], limit = 6): Plato[] {
  return categorias
    .flatMap((categoria) => categoria.platos)
    .filter((plato) => plato.disponible)
    .slice(0, limit);
}
