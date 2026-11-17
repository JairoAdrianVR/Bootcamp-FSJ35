"use client";

import { useState, type FormEvent } from "react";
import type { Categoria, CreateCategoriaInput } from "@/features/categorias/types";

export function CategoriaForm({
  initial,
  onSubmit,
  submitting,
  error,
}: {
  initial?: Categoria | null;
  onSubmit: (input: CreateCategoriaInput) => Promise<void>;
  submitting: boolean;
  error: string | null;
}) {
  const [nombre, setNombre] = useState(initial?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      nombre,
      descripcion: descripcion || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <h3 className="font-medium">{initial ? "Editar categoria" : "Nueva categoria"}</h3>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
        required
        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <textarea
        value={descripcion ?? ""}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripcion"
        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {submitting ? "Guardando..." : initial ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}
