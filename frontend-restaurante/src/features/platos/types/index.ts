import type { Categoria } from "@/features/categorias/types";

export interface Plato {
  id: number;
  categoria_id: number;
  categoria?: Categoria | null;
  nombre: string;
  descripcion: string | null;
  precio: number | string;
  imagen: string | null;
  disponible: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePlatoInput {
  categoria_id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  imagen?: string | null;
  disponible?: boolean;
}

export type UpdatePlatoInput = Partial<CreatePlatoInput>;
