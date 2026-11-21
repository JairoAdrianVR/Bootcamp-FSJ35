import { apiRequest } from "@/shared/lib/apiClient";
import type {
  Pedido,
  CreatePedidoInput,
  UpdatePedidoInput,
} from "@/features/pedidos/types";
import type { PaginatedResponse } from "@/shared/types/api";

export interface PedidosListParams {
  estado?: string;
  mesa?: string;
  page?: number;
}

export const pedidosService = {
  list: (params: PedidosListParams = {}) =>
    apiRequest<PaginatedResponse<Pedido>>("/pedidos", {
      query: {
        estado: params.estado,
        mesa: params.mesa,
        page: params.page,
      },
    }),

  get: (id: number) => apiRequest<Pedido>(`/pedidos/${id}`),

  create: (input: CreatePedidoInput) =>
    apiRequest<Pedido>("/pedidos", { method: "POST", body: input }),

  update: (id: number, input: UpdatePedidoInput) =>
    apiRequest<Pedido>(`/pedidos/${id}`, { method: "PATCH", body: input }),

  remove: (id: number) => apiRequest<void>(`/pedidos/${id}`, { method: "DELETE" }),
};
