export interface LugarTuristico {
  id: string;
  slug: string;
  nombre: string;
  departamento: string;
  categoria: string;
  categoria_slug: string;
  descripcion_corta: string;
  descripcion_completa: string;
  imagen_url: string;
  galeria: string[];
  clima: string;
  precio_entrada: number;
  rating: number;
  dificultad: 'Fácil' | 'Moderada' | 'Moderada - Alta' | 'Alta';
  ubicacion: string;
  destacado: boolean;
  horario: string;
  actividades: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CategoriaInfo {
  nombre: string;
  slug: string;
  descripcion: string;
  icono: string;
  imagen_url: string;
  total_lugares?: number;
}
