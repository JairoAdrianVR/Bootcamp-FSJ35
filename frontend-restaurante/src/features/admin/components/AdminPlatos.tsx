"use client";

import { useCallback, useEffect, useState } from "react";
import { platosService } from "@/features/platos/services/platos.service";
import { categoriasService } from "@/features/categorias/services/categorias.service";
import { PlatoTable } from "@/features/platos/components/PlatoTable";
import { PlatoForm } from "@/features/platos/components/PlatoForm";
import type { Plato } from "@/features/platos/types";
import type { Categoria } from "@/features/categorias/types";
import { ApiError } from "@/shared/types/api";

export function AdminPlatos() {
  const [items, setItems] = useState<Plato[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Plato | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [platosRes, catsRes] = await Promise.all([
        platosService.list(),
        categoriasService.list(),
      ]);
      setItems(platosRes.data);
      setCategorias(catsRes.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudieron cargar los platos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [platosRes, catsRes] = await Promise.all([
          platosService.list(),
          categoriasService.list(),
        ]);
        if (active) {
          setItems(platosRes.data);
          setCategorias(catsRes.data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof ApiError ? err.message : "No se pudieron cargar los platos.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(input: Parameters<typeof platosService.create>[0]) {
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
      await load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No se pudo guardar.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(plato: Plato) {
    if (!confirm(`Eliminar plato "${plato.nombre}"?`)) return;
    try {
      await platosService.remove(plato.id);
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "No se pudo eliminar.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platos</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Administra los platos de tu carta.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm((v) => !v);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90"
        >
          {showForm ? "Cerrar" : "+ Nuevo plato"}
        </button>
      </div>

      {showForm ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <PlatoForm
            key={editing?.id ?? "new"}
            initial={editing}
            categorias={categorias}
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
          <PlatoTable
            items={items}
            onEdit={(p) => {
              setEditing(p);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
