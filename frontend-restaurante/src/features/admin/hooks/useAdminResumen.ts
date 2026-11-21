"use client";

import { useEffect, useState } from "react";
import { categoriasService } from "@/features/categorias";
import { platosService } from "@/features/platos";
import { pedidosService } from "@/features/pedidos";
import { getErrorMessage } from "@/shared/lib/errors";

const LOAD_ERROR = "No se pudo cargar el resumen.";

export interface AdminResumen {
  categorias: number;
  platos: number;
  pedidos: number;
}

/**
 * Resultado del hook: totales + estado de la carga.
 * Extiende `AdminResumen`, así que sigue siendo compatible con quien solo lee los totales.
 */
export interface UseAdminResumenResult extends AdminResumen {
  loading: boolean;
  error: string | null;
}

const INITIAL_RESUMEN: AdminResumen = { categorias: 0, platos: 0, pedidos: 0 };

/**
 * Totales de categorías, platos y pedidos para el dashboard de administración.
 */
export function useAdminResumen(): UseAdminResumenResult {
  const [resumen, setResumen] = useState<AdminResumen>(INITIAL_RESUMEN);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([categoriasService.list(), platosService.list(), pedidosService.list()])
      .then(([categorias, platos, pedidos]) => {
        if (!active) return;
        setResumen({
          categorias: categorias.meta.total,
          platos: platos.meta.total,
          pedidos: pedidos.meta.total,
        });
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(getErrorMessage(err, LOAD_ERROR));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { ...resumen, loading, error };
}
