export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  platos_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoriaInput {
  nombre: string;
  descripcion?: string | null;
}

export type UpdateCategoriaInput = Partial<CreateCategoriaInput>;
