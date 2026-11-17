import type { PedidoEstado } from "@/features/pedidos/types";

const colors: Record<PedidoEstado, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  en_preparacion: "bg-blue-100 text-blue-800",
  listo: "bg-green-100 text-green-800",
  entregado: "bg-zinc-200 text-zinc-800",
  cancelado: "bg-red-100 text-red-800",
};

export function PedidoEstadoBadge({ estado }: { estado: PedidoEstado }) {
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${colors[estado]}`}>
      {estado.replace("_", " ")}
    </span>
  );
}
