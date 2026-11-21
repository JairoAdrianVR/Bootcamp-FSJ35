import type { Categoria } from "@/features/categorias/types";
import type { Plato } from "@/features/platos/types";

export interface MenuCategoria extends Categoria {
  platos: Plato[];
}

export interface MenuPlatosParams {
  categoria_id?: number;
  buscar?: string;
}
