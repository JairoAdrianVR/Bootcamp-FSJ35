"use client";

import type { Pedido } from "@/features/pedidos/types";
import { PedidoEstadoBadge } from "@/features/pedidos/components/PedidoEstadoBadge";

function EstadoSelector({
  pedido,
  onCambiarEstado,
}: {
  pedido: Pedido;
  onCambiarEstado: (pedido: Pedido, estado: Pedido["estado"]) => void;
}) {
  return (
    <select
      value={pedido.estado}
      onChange={(e) =>
        onCambiarEstado(pedido, e.target.value as Pedido["estado"])
      }
      aria-label={`Estado del pedido #${pedido.id}`}
      className="rounded border border-border px-2 py-1 text-xs text-foreground bg-background dark:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <option value="pendiente">pendiente</option>
      <option value="en_preparacion">en_preparacion</option>
      <option value="listo">listo</option>
      <option value="entregado">entregado</option>
      <option value="cancelado">cancelado</option>
    </select>
  );
}

function PedidoAcciones({
  pedido,
  onVer,
  onEliminar,
}: {
  pedido: Pedido;
  onVer: (pedido: Pedido) => void;
  onEliminar: (pedido: Pedido) => void;
}) {
  return (
    <td className="px-4 py-2 text-right">
      <button
        onClick={() => onVer(pedido)}
        aria-label={`Ver pedido #${pedido.id}`}
        className="rounded bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Ver
      </button>
      <button
        onClick={() => onEliminar(pedido)}
        aria-label={`Eliminar pedido #${pedido.id}`}
        className="ml-2 rounded border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Eliminar
      </button>
    </td>
  );
}

function PedidoRow({
  pedido,
  onVer,
  onEliminar,
  onCambiarEstado,
}: {
  pedido: Pedido;
  onVer: (pedido: Pedido) => void;
  onEliminar: (pedido: Pedido) => void;
  onCambiarEstado: (pedido: Pedido, estado: Pedido["estado"]) => void;
}) {
  return (
    <tr
      key={pedido.id}
      className="border-t border-border transition hover:bg-accent/5"
    >
      <td className="px-4 py-2 font-medium text-foreground">#{pedido.id}</td>
      <td className="px-4 py-2 text-muted-foreground">{pedido.mesa ?? "-"}</td>
      <td className="px-4 py-2">
        <div className="flex items-center gap-2">
          <PedidoEstadoBadge estado={pedido.estado} />
          <EstadoSelector pedido={pedido} onCambiarEstado={onCambiarEstado} />
        </div>
      </td>
      <td className="px-4 py-2 text-foreground">
        {Number(pedido.total).toFixed(2)}
      </td>
      <PedidoAcciones
        pedido={pedido}
        onVer={onVer}
        onEliminar={onEliminar}
      />
    </tr>
  );
}

export function PedidoTable({
  items,
  onVer,
  onEliminar,
  onCambiarEstado,
}: {
  items: Pedido[];
  onVer: (pedido: Pedido) => void;
  onEliminar: (pedido: Pedido) => void;
  onCambiarEstado: (pedido: Pedido, estado: Pedido["estado"]) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              ID
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Mesa
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Estado
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Total
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((pedido) => (
            <PedidoRow
              key={pedido.id}
              pedido={pedido}
              onVer={onVer}
              onEliminar={onEliminar}
              onCambiarEstado={onCambiarEstado}
            />
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                Sin pedidos.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
