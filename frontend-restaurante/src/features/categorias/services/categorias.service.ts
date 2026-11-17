import { apiRequest } from "@/shared/lib/apiClient";
import type {
  Categoria,
  CreateCategoriaInput,
  UpdateCategoriaInput,
} from "@/features/categorias/types";
import type { PaginatedResponse } from "@/shared/types/api";

export const categoriasService = {
  list: (page = 1) =>
    apiRequest<PaginatedResponse<Categoria>>("/categorias", {
      query: { page },
    }),

  get: (id: number) => apiRequest<Categoria>(`/categorias/${id}`),

  create: (input: CreateCategoriaInput) =>
    apiRequest<Categoria>("/categorias", { method: "POST", body: input }),

  update: (id: number, input: UpdateCategoriaInput) =>
    apiRequest<Categoria>(`/categorias/${id}`, { method: "PUT", body: input }),

  remove: (id: number) =>
    apiRequest<void>(`/categorias/${id}`, { method: "DELETE" }),
};
