import { apiRequest } from "@/shared/lib/apiClient";
import type { MenuCategoria } from "@/features/menu/types";
import type { Plato } from "@/features/platos/types";
import type { PaginatedResponse } from "@/shared/types/api";

interface MenuPlatosParams {
  categoria_id?: number;
  buscar?: string;
  page?: number;
}

export const menuService = {
  categorias: () => apiRequest<MenuCategoria[]>("/menu/categorias"),

  platos: (params: MenuPlatosParams = {}) =>
    apiRequest<PaginatedResponse<Plato>>("/menu/platos", {
      query: {
        categoria_id: params.categoria_id,
        buscar: params.buscar,
        page: params.page,
      },
    }),

  plato: (id: number) => apiRequest<Plato>(`/menu/platos/${id}`),
};
