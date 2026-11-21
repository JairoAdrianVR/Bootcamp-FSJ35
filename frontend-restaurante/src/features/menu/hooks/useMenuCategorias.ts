"use client";

import { useEffect, useState } from "react";
import { menuService } from "@/features/menu/services/menu.service";
import type { MenuCategoria } from "@/features/menu/types";
import { getErrorMessage } from "@/shared/lib/errors";

export interface UseMenuCategoriasResult {
  categorias: MenuCategoria[];
  loading: boolean;
  error: string | null;
}

/**
 * Carga las categorías del menú (con sus platos) una sola vez al montar.
 */
export function useMenuCategorias(): UseMenuCategoriasResult {
  const [categorias, setCategorias] = useState<MenuCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    menuService
      .categorias()
      .then((data) => {
        if (active) setCategorias(data);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, "No se pudo cargar el menú."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { categorias, loading, error };
}
