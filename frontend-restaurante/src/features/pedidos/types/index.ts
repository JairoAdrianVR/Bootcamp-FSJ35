import type { Plato } from "@/features/platos/types";

export type PedidoEstado =
  | "pendiente"
  | "en_preparacion"
  | "listo"
  | "entregado"
  | "cancelado";

export interface PedidoItem {
  id: number;
  plato_id: number;
  plato?: Plato | null;
  cantidad: number;
  precio_unitario: number | string;
  subtotal: number | string;
}

export interface Pedido {
  id: number;
  mesa: string | null;
  estado: PedidoEstado;
  total: number | string;
  notas: string | null;
  items?: PedidoItem[];
  created_at: string;
  updated_at: string;
}

export interface CreatePedidoItemInput {
  plato_id: number;
  cantidad: number;
}

export interface CreatePedidoInput {
  mesa?: string | null;
  notas?: string | null;
  items: CreatePedidoItemInput[];
}

export interface UpdatePedidoInput {
  mesa?: string | null;
  estado?: PedidoEstado;
  notas?: string | null;
}
