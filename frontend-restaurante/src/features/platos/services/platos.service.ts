import { apiRequest } from "@/shared/lib/apiClient";
import type {
  Plato,
  CreatePlatoInput,
  UpdatePlatoInput,
} from "@/features/platos/types";
import type { PaginatedResponse } from "@/shared/types/api";

export interface PlatosListParams {
  categoria_id?: number;
  disponible?: boolean;
  buscar?: string;
  page?: number;
}

export const platosService = {
  list: (params: PlatosListParams = {}) =>
    apiRequest<PaginatedResponse<Plato>>("/platos", {
      query: {
        categoria_id: params.categoria_id,
        disponible: params.disponible,
        buscar: params.buscar,
        page: params.page,
      },
    }),

  get: (id: number) => apiRequest<Plato>(`/platos/${id}`),

  create: (input: CreatePlatoInput) =>
    apiRequest<Plato>("/platos", { method: "POST", body: input }),

  update: (id: number, input: UpdatePlatoInput) =>
    apiRequest<Plato>(`/platos/${id}`, { method: "PUT", body: input }),

  remove: (id: number) => apiRequest<void>(`/platos/${id}`, { method: "DELETE" }),
};
