"use client";

import { useCallback, useEffect, useState } from "react";
import {
  categoriasService,
  type Categoria,
  type CreateCategoriaInput,
} from "@/features/categorias";
import { getErrorMessage } from "@/shared/lib/errors";

const LOAD_ERROR = "No se pudieron cargar las categorias.";

async function fetchCategoriasAdminData(): Promise<Categoria[]> {
  const res = await categoriasService.list();
  return res.data;
}

export interface UseCategoriasAdminResult {
  items: Categoria[];
  loading: boolean;
  error: string | null;
  editing: Categoria | null;
  showForm: boolean;
  submitting: boolean;
  formError: string | null;
  /** Abre el formulario en modo creación o lo cierra si ya estaba abierto. */
  toggleForm: () => void;
  /** Abre el formulario en modo edición para la categoría indicada. */
  openEdit: (categoria: Categoria) => void;
  /** Crea o actualiza (según `editing`) y recarga la lista. */
  save: (input: CreateCategoriaInput) => Promise<void>;
  /** Elimina y recarga. Devuelve el mensaje de error o `null` si fue bien. */
  remove: (id: number) => Promise<string | null>;
}

/**
 * Estado y operaciones del panel de categorías.
 */
export function useCategoriasAdmin(): UseCategoriasAdminResult {
  const [items, setItems] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const reload = useCallback(
    () =>
      fetchCategoriasAdminData().then(
        (data) => {
          setItems(data);
          setError(null);
          setLoading(false);
        },
        (err: unknown) => {
          setError(getErrorMessage(err, LOAD_ERROR));
          setLoading(false);
        },
      ),
    [],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  function toggleForm() {
    setEditing(null);
    setShowForm((open) => !open);
  }

  function openEdit(categoria: Categoria) {
    setEditing(categoria);
    setShowForm(true);
  }

  async function save(input: CreateCategoriaInput) {
    setSubmitting(true);
    setFormError(null);
    try {
      if (editing) {
        await categoriasService.update(editing.id, input);
      } else {
        await categoriasService.create(input);
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
      await categoriasService.remove(id);
      setLoading(true);
      await reload();
      return null;
    } catch (err) {
      return getErrorMessage(err, "No se pudo eliminar.");
    }
  }

  return {
    items,
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
