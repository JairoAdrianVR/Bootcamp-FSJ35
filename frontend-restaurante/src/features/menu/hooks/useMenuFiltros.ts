"use client";

import { useMemo, useState } from "react";
import type { MenuCategoria } from "@/features/menu/types";

export interface UseMenuFiltrosResult {
  search: string;
  setSearch: (value: string) => void;
  selected: number | null;
  setSelected: (id: number | null) => void;
  /** Categorías con sus platos disponibles filtrados por texto y categoría. */
  filtered: MenuCategoria[];
  /** Total de platos disponibles (sin filtros). */
  totalPlatos: number;
}

/**
 * Filtrado del menú por texto y categoría seleccionada.
 */
export function useMenuFiltros(categorias: MenuCategoria[]): UseMenuFiltrosResult {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return categorias
      .filter((categoria) => (selected === null ? true : categoria.id === selected))
      .map((categoria) => ({
        ...categoria,
        platos: categoria.platos.filter((plato) => {
          if (!plato.disponible) return false;
          if (!term) return true;
          return (
            plato.nombre.toLowerCase().includes(term) ||
            (plato.descripcion ?? "").toLowerCase().includes(term)
          );
        }),
      }))
      .filter((categoria) => categoria.platos.length > 0);
  }, [categorias, search, selected]);

  const totalPlatos = useMemo(
    () =>
      categorias.reduce(
        (acc, categoria) => acc + categoria.platos.filter((plato) => plato.disponible).length,
        0,
      ),
    [categorias],
  );

  return { search, setSearch, selected, setSelected, filtered, totalPlatos };
}
