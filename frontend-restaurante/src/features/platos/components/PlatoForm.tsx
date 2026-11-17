"use client";

import { useState, type FormEvent } from "react";
import type { Plato, CreatePlatoInput } from "@/features/platos/types";
import type { Categoria } from "@/features/categorias/types";

export function PlatoForm({
  initial,
  categorias,
  onSubmit,
  submitting,
  error,
}: {
  initial?: Plato | null;
  categorias: Categoria[];
  onSubmit: (input: CreatePlatoInput) => Promise<void>;
  submitting: boolean;
  error: string | null;
}) {
  const [categoriaId, setCategoriaId] = useState<number | null>(initial?.categoria_id ?? null);
  const [nombre, setNombre] = useState(initial?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? "");
  const [precio, setPrecio] = useState(initial?.precio ? String(initial.precio) : "");
  const [imagen, setImagen] = useState(initial?.imagen ?? "");
  const [disponible, setDisponible] = useState(initial?.disponible ?? true);

  const selectedCategoriaId =
    categoriaId && categorias.some((c) => c.id === categoriaId)
      ? categoriaId
      : (initial?.categoria_id ?? categorias[0]?.id ?? 0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      categoria_id: Number(selectedCategoriaId),
      nombre,
      descripcion: descripcion || null,
      precio: Number(precio),
      imagen: imagen || null,
      disponible,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <h3 className="font-medium">{initial ? "Editar plato" : "Nuevo plato"}</h3>
      <select
        value={selectedCategoriaId}
        onChange={(e) => setCategoriaId(Number(e.target.value))}
        required
        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>
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
      <input
        type="number"
        step="0.01"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        placeholder="Precio"
        required
        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <input
        value={imagen ?? ""}
        onChange={(e) => setImagen(e.target.value)}
        placeholder="URL imagen"
        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={disponible}
          onChange={(e) => setDisponible(e.target.checked)}
        />
        Disponible
      </label>
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
