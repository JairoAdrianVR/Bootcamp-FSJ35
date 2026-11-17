"use client";

import { useEffect, useState } from "react";
import type { Pedido } from "@/features/pedidos/types";
import { PedidoEstadoBadge } from "@/features/pedidos/components/PedidoEstadoBadge";

function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(num) ? num.toFixed(2) : String(value);
}

export function PedidoDetailModal({
  open,
  pedido,
  loading,
  onClose,
}: {
  open: boolean;
  pedido: Pedido | null;
  loading: boolean;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    // Reset animation state on close; safe because it mirrors prop changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(false);
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl transform rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 dark:bg-zinc-900 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">Pedido #{pedido?.id ?? ""}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-zinc-500">Cargando detalle...</p>
        ) : !pedido ? (
          <p className="text-sm text-red-600">No se pudo cargar el pedido.</p>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
                <p className="text-xs text-zinc-500">Mesa</p>
                <p className="font-medium">{pedido.mesa ?? "-"}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
                <p className="text-xs text-zinc-500">Estado</p>
                <div className="mt-1">
                  <PedidoEstadoBadge estado={pedido.estado} />
                </div>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
                <p className="text-xs text-zinc-500">Total</p>
                <p className="font-bold text-orange-600">{formatPrice(pedido.total)}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
                <p className="text-xs text-zinc-500">Fecha</p>
                <p className="font-medium">{new Date(pedido.created_at).toLocaleString()}</p>
              </div>
            </div>

            {pedido.notas ? (
              <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                <p className="text-xs font-semibold uppercase">Notas</p>
                <p>{pedido.notas}</p>
              </div>
            ) : null}

            <div>
              <h4 className="mb-2 font-semibold">Items</h4>
              <div className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
                {(pedido.items ?? []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {item.plato?.nombre ?? `Plato #${item.plato_id}`}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {item.cantidad} x {formatPrice(item.precio_unitario)}
                      </p>
                    </div>
                    <span className="shrink-0 font-semibold">{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
                {(pedido.items ?? []).length === 0 ? (
                  <p className="p-3 text-sm text-zinc-500">Sin items.</p>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
