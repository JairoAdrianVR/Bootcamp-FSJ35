import { createServerClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { MOCK_LUGARES, MOCK_CATEGORIAS } from '@/lib/data/mockPlaces';
import { LugarTuristico, CategoriaInfo } from '@/types/place';

export interface DataFetchResult<T> {
  data: T;
  source: 'supabase' | 'fallback';
  error?: string | null;
}

/**
 * Obtiene todos los lugares turísticos desde Supabase (o datos de respaldo si no está configurado)
 */
export async function getLugares(): Promise<DataFetchResult<LugarTuristico[]>> {
  const supabase = createServerClient();

  if (!supabase) {
    return {
      data: MOCK_LUGARES,
      source: 'fallback',
      error: 'Supabase no está configurado con variables de entorno válidas.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('lugares_turisticos')
      .select('*')
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error al consultar lugares_turisticos en Supabase:', error.message);
      return {
        data: MOCK_LUGARES,
        source: 'fallback',
        error: error.message,
      };
    }

    if (!data || data.length === 0) {
      return {
        data: MOCK_LUGARES,
        source: 'fallback',
        error: 'La tabla lugares_turisticos está vacía en Supabase. Ejecuta el script schema.sql.',
      };
    }

    return {
      data: data as LugarTuristico[],
      source: 'supabase',
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido al conectar con Supabase';
    console.error('Excepción al conectar con Supabase:', message);
    return {
      data: MOCK_LUGARES,
      source: 'fallback',
      error: message,
    };
  }
}

/**
 * Obtiene un lugar turístico específico por su slug (Ruta Dinámica 1: /lugares/[slug])
 */
export async function getLugarBySlug(slug: string): Promise<DataFetchResult<LugarTuristico | null>> {
  const supabase = createServerClient();

  if (!supabase) {
    const found = MOCK_LUGARES.find((p) => p.slug === slug) || null;
    return {
      data: found,
      source: 'fallback',
      error: 'Supabase no configurado.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('lugares_turisticos')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`Error consultando lugar ${slug} en Supabase:`, error.message);
      const fallback = MOCK_LUGARES.find((p) => p.slug === slug) || null;
      return {
        data: fallback,
        source: 'fallback',
        error: error.message,
      };
    }

    if (!data) {
      const fallback = MOCK_LUGARES.find((p) => p.slug === slug) || null;
      return {
        data: fallback,
        source: fallback ? 'fallback' : 'supabase',
        error: fallback ? null : 'Lugar no encontrado en la base de datos.',
      };
    }

    return {
      data: data as LugarTuristico,
      source: 'supabase',
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al conectar con Supabase';
    const fallback = MOCK_LUGARES.find((p) => p.slug === slug) || null;
    return {
      data: fallback,
      source: 'fallback',
      error: message,
    };
  }
}

/**
 * Obtiene lugares turísticos filtrados por categoría (Ruta Dinámica 2: /categorias/[slug])
 */
export async function getLugaresByCategoria(categoriaSlug: string): Promise<DataFetchResult<LugarTuristico[]>> {
  const supabase = createServerClient();

  if (!supabase) {
    const filtered = MOCK_LUGARES.filter((p) => p.categoria_slug === categoriaSlug);
    return {
      data: filtered,
      source: 'fallback',
      error: 'Supabase no configurado.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('lugares_turisticos')
      .select('*')
      .eq('categoria_slug', categoriaSlug)
      .order('rating', { ascending: false });

    if (error) {
      console.error(`Error consultando categoria ${categoriaSlug} en Supabase:`, error.message);
      const filtered = MOCK_LUGARES.filter((p) => p.categoria_slug === categoriaSlug);
      return {
        data: filtered,
        source: 'fallback',
        error: error.message,
      };
    }

    if (!data || data.length === 0) {
      const filtered = MOCK_LUGARES.filter((p) => p.categoria_slug === categoriaSlug);
      return {
        data: filtered.length > 0 ? filtered : [],
        source: filtered.length > 0 ? 'fallback' : 'supabase',
        error: null,
      };
    }

    return {
      data: data as LugarTuristico[],
      source: 'supabase',
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al conectar con Supabase';
    const filtered = MOCK_LUGARES.filter((p) => p.categoria_slug === categoriaSlug);
    return {
      data: filtered,
      source: 'fallback',
      error: message,
    };
  }
}

/**
 * Obtiene los lugares marcados como destacados
 */
export async function getLugaresDestacados(): Promise<DataFetchResult<LugarTuristico[]>> {
  const supabase = createServerClient();

  if (!supabase) {
    return {
      data: MOCK_LUGARES.filter((p) => p.destacado),
      source: 'fallback',
      error: null,
    };
  }

  try {
    const { data, error } = await supabase
      .from('lugares_turisticos')
      .select('*')
      .eq('destacado', true)
      .order('rating', { ascending: false });

    if (error || !data || data.length === 0) {
      return {
        data: MOCK_LUGARES.filter((p) => p.destacado),
        source: 'fallback',
        error: error?.message || null,
      };
    }

    return {
      data: data as LugarTuristico[],
      source: 'supabase',
      error: null,
    };
  } catch {
    return {
      data: MOCK_LUGARES.filter((p) => p.destacado),
      source: 'fallback',
      error: null,
    };
  }
}

/**
 * Obtiene información de todas las categorías disponibles
 */
export async function getCategorias(): Promise<CategoriaInfo[]> {
  const { data: lugares } = await getLugares();
  
  return MOCK_CATEGORIAS.map((cat) => {
    const count = lugares.filter((p) => p.categoria_slug === cat.slug).length;
    return {
      ...cat,
      total_lugares: count,
    };
  });
}
