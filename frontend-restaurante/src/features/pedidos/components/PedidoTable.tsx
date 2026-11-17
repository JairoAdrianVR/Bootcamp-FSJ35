"use client";

import type { Pedido } from "@/features/pedidos/types";
import { PedidoEstadoBadge } from "@/features/pedidos/components/PedidoEstadoBadge";

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
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Mesa</th>
            <th className="px-4 py-2 text-left">Estado</th>
            <th className="px-4 py-2 text-left">Total</th>
            <th className="px-4 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((pedido) => (
            <tr key={pedido.id} className="border-t border-zinc-200 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50">
              <td className="px-4 py-2 font-medium">#{pedido.id}</td>
              <td className="px-4 py-2">{pedido.mesa ?? "-"}</td>
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <PedidoEstadoBadge estado={pedido.estado} />
                  <select
                    value={pedido.estado}
                    onChange={(e) => onCambiarEstado(pedido, e.target.value as Pedido["estado"])}
                    className="rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <option value="pendiente">pendiente</option>
                    <option value="en_preparacion">en_preparacion</option>
                    <option value="listo">listo</option>
                    <option value="entregado">entregado</option>
                    <option value="cancelado">cancelado</option>
                  </select>
                </div>
              </td>
              <td className="px-4 py-2">{Number(pedido.total).toFixed(2)}</td>
              <td className="px-4 py-2 text-right">
                <button onClick={() => onVer(pedido)} className="mr-2 text-blue-600 hover:underline">
                  Ver
                </button>
                <button onClick={() => onEliminar(pedido)} className="text-red-600 hover:underline">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-zinc-500">
                Sin pedidos.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
