import type { PedidoEstado } from "@/features/pedidos/types";

const variantes: Record<PedidoEstado, string> = {
  pendiente: "bg-accent/10 text-accent",
  en_preparacion: "bg-accent/10 text-accent",
  listo: "bg-accent text-accent-foreground",
  entregado: "bg-muted text-muted-foreground",
  cancelado: "bg-muted/50 text-muted-foreground/70",
};

export function PedidoEstadoBadge({ estado }: { estado: PedidoEstado }) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs font-medium ${variantes[estado]}`}
      aria-label={`Estado: ${estado.replace("_", " ")}`}
    >
      {estado.replace("_", " ")}
    </span>
  );
}
