"use client";

import { useCallback, useEffect, useState } from "react";
import {
  platosService,
  type CreatePlatoInput,
  type Plato,
} from "@/features/platos";
import { categoriasService, type Categoria } from "@/features/categorias";
import { getErrorMessage } from "@/shared/lib/errors";

const LOAD_ERROR = "No se pudieron cargar los platos.";

interface PlatosAdminData {
  items: Plato[];
  categorias: Categoria[];
}

async function fetchPlatosAdminData(): Promise<PlatosAdminData> {
  const [platosRes, categoriasRes] = await Promise.all([
    platosService.list(),
    categoriasService.list(),
  ]);
  return { items: platosRes.data, categorias: categoriasRes.data };
}

export interface UsePlatosAdminResult {
  items: Plato[];
  categorias: Categoria[];
  loading: boolean;
  error: string | null;
  editing: Plato | null;
  showForm: boolean;
  submitting: boolean;
  formError: string | null;
  /** Abre el formulario en modo creación o lo cierra si ya estaba abierto. */
  toggleForm: () => void;
  /** Abre el formulario en modo edición para el plato indicado. */
  openEdit: (plato: Plato) => void;
  /** Crea o actualiza (según `editing`) y recarga la lista. */
  save: (input: CreatePlatoInput) => Promise<void>;
  /** Elimina y recarga. Devuelve el mensaje de error o `null` si fue bien. */
  remove: (id: number) => Promise<string | null>;
}

/**
 * Estado y operaciones del panel de platos (listado + categorías para el formulario).
 */
export function usePlatosAdmin(): UsePlatosAdminResult {
  const [items, setItems] = useState<Plato[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Plato | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const applyData = useCallback((data: PlatosAdminData) => {
    setItems(data.items);
    setCategorias(data.categorias);
  }, []);

  const reload = useCallback(
    () =>
      fetchPlatosAdminData().then(
        (data) => {
          applyData(data);
          setError(null);
          setLoading(false);
        },
        (err: unknown) => {
          setError(getErrorMessage(err, LOAD_ERROR));
          setLoading(false);
        },
      ),
    [applyData],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  function toggleForm() {
    setEditing(null);
    setShowForm((open) => !open);
  }

  function openEdit(plato: Plato) {
    setEditing(plato);
    setShowForm(true);
  }

  async function save(input: CreatePlatoInput) {
    setSubmitting(true);
    setFormError(null);
    try {
      if (editing) {
        await platosService.update(editing.id, input);
      } else {
        await platosService.create(input);
      }
      setEditing(null);
      setShowForm(false);
      setLoading(true);
      await reload();
    } catch (err) {
      setFormError(getErrorMessage(err, "No se pudo guardar."));
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: number): Promise<string | null> {
    try {
      await platosService.remove(id);
      setLoading(true);
      await reload();
      return null;
    } catch (err) {
      return getErrorMessage(err, "No se pudo eliminar.");
    }
  }

  return {
    items,
    categorias,
    loading,
    error,
    editing,
    showForm,
    submitting,
    formError,
    toggleForm,
    openEdit,
    save,
    remove,
  };
}
