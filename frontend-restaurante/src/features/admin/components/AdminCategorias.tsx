"use client";

import { useCallback, useEffect, useState } from "react";
import { categoriasService } from "@/features/categorias/services/categorias.service";
import { CategoriaTable } from "@/features/categorias/components/CategoriaTable";
import { CategoriaForm } from "@/features/categorias/components/CategoriaForm";
import type { Categoria } from "@/features/categorias/types";
import { ApiError } from "@/shared/types/api";

export function AdminCategorias() {
  const [items, setItems] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await categoriasService.list();
      setItems(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudieron cargar las categorias.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await categoriasService.list();
        if (active) setItems(res.data);
      } catch (err) {
        if (active) {
          setError(err instanceof ApiError ? err.message : "No se pudieron cargar las categorias.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(input: { nombre: string; descripcion?: string | null }) {
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
      await load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No se pudo guardar.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(categoria: Categoria) {
    if (!confirm(`Eliminar categoria "${categoria.nombre}"?`)) return;
    try {
      await categoriasService.remove(categoria.id);
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "No se pudo eliminar.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Categorias</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Organiza los platos de tu carta por categorias.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm((v) => !v);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90"
        >
          {showForm ? "Cerrar" : "+ Nueva categoria"}
        </button>
      </div>

      {showForm ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <CategoriaForm
            key={editing?.id ?? "new"}
            initial={editing}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={formError}
          />
        </div>
      ) : null}

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {loading ? (
          <p className="p-4 text-sm text-zinc-500">Cargando...</p>
        ) : error ? (
          <p className="p-4 text-sm text-red-600">{error}</p>
        ) : (
          <CategoriaTable
            items={items}
            onEdit={(c) => {
              setEditing(c);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
