"use client";

import { useEffect, useRef, useState } from "react";
import type { Pedido } from "@/features/pedidos/types";
import { PedidoEstadoBadge } from "@/features/pedidos/components/PedidoEstadoBadge";

const FOCUSABLE_SELECTORS = [
  "button:not([disabled])",
  'a[href]',
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
].join(", ");

function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(num) ? num.toFixed(2) : String(value);
}

function DatoInfo({
  etiqueta,
  valor,
}: {
  etiqueta: string;
  valor: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3 dark:bg-muted">
      <p className="text-xs text-muted-foreground">{etiqueta}</p>
      <p className="font-medium text-foreground">{valor}</p>
    </div>
  );
}

function ItemPedido({
  item,
  formatPriceRef,
}: {
  item: { id: number; plato?: { nombre: string } | null; plato_id: number; cantidad: number; precio_unitario: number | string; subtotal: number | string };
  formatPriceRef: (value: number | string) => string;
}) {
  return (
    <div key={item.id} className="flex items-center justify-between gap-3 p-3">
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">
          {item.plato?.nombre ?? `Plato #${item.plato_id}`}
        </p>
        <p className="text-xs text-muted-foreground">
          {item.cantidad} x {formatPriceRef(item.precio_unitario)}
        </p>
      </div>
      <span className="shrink-0 font-semibold text-foreground">
        {formatPriceRef(item.subtotal)}
      </span>
    </div>
  );
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
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement | null;
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    // Reset animation state on close; safe because it mirrors prop changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(false);
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open || !containerRef.current) return undefined;
    const container = containerRef.current;
    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Foco inicial: botón de cerrar, o el primer elemento enfocable.
    const closeBtn = container.querySelector<HTMLElement>(
      'button[aria-label="Cerrar"]',
    );
    (closeBtn ?? first)?.focus();

    function handleKeydown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      if (focusable.length === 0) return;
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    container.addEventListener("keydown", handleKeydown);
    return () => container.removeEventListener("keydown", handleKeydown);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Retorna el foco al elemento activo antes de abrir el diálogo.
  useEffect(() => {
    if (open) return undefined;
    if (!visible && previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
    return undefined;
  }, [open, visible]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pedido-detail-title"
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl rounded-2xl bg-background p-6 shadow-2xl transition-all duration-300 dark:bg-muted ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 id="pedido-detail-title" className="font-display text-xl font-bold text-foreground">
            Pedido #{pedido?.id ?? ""}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando detalle...</p>
        ) : !pedido ? (
          <p className="text-sm font-medium text-foreground">
            No se pudo cargar el pedido.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <DatoInfo etiqueta="Mesa" valor={pedido.mesa ?? "-"} />
              <DatoInfo
                etiqueta="Estado"
                valor={
                  <div className="mt-1">
                    <PedidoEstadoBadge estado={pedido.estado} />
                  </div>
                }
              />
              <DatoInfo
                etiqueta="Total"
                valor={
                  <p className="font-bold text-accent">
                    {formatPrice(pedido.total)}
                  </p>
                }
              />
              <DatoInfo
                etiqueta="Fecha"
                valor={new Date(pedido.created_at).toLocaleString()}
              />
            </div>

            {pedido.notas ? (
              <div className="rounded-lg border border-border bg-background p-3 dark:bg-muted">
                <p className="text-xs font-medium text-muted-foreground">
                  Notas
                </p>
                <p className="text-muted-foreground">{pedido.notas}</p>
              </div>
            ) : null}

            <div>
              <h4 className="mb-2 font-semibold text-foreground">Items</h4>
              <div className="divide-y divide-border rounded-lg border border-border">
                {(pedido.items ?? []).map((item) => (
                  <ItemPedido
                    key={item.id}
                    item={item}
                    formatPriceRef={formatPrice}
                  />
                ))}
                {(pedido.items ?? []).length === 0 ? (
                  <p className="p-3 text-sm text-muted-foreground">
                    Sin items.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
