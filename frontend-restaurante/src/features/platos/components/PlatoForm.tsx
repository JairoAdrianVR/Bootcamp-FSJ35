"use client";

import { useId, useState, type FormEvent } from "react";
import type { Plato, CreatePlatoInput } from "@/features/platos/types";
import type { Categoria } from "@/features/categorias/types";

function CampoFormulario({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function InputTexto({
  id,
  type = "text",
  step,
  value,
  onChange,
  placeholder,
  required,
}: {
  id: string;
  type?: string;
  step?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <input
      id={id}
      type={type}
      step={step}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground dark:bg-muted dark:text-foreground dark:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    />
  );
}

function AreaTexto({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground dark:bg-muted dark:text-foreground dark:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    />
  );
}

function SelectCategorias({
  id,
  value,
  onChange,
  categorias,
}: {
  id: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  categorias: Categoria[];
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      required
      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground dark:bg-muted dark:text-foreground dark:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {categorias.map((c) => (
        <option key={c.id} value={c.id}>
          {c.nombre}
        </option>
      ))}
    </select>
  );
}

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
  const idCategoria = useId();
  const idNombre = useId();
  const idDescripcion = useId();
  const idPrecio = useId();
  const idImagen = useId();

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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-border p-6 bg-background dark:bg-muted"
    >
      <h3 className="font-display text-lg font-semibold text-foreground">
        {initial ? "Editar plato" : "Nuevo plato"}
      </h3>
      <CampoFormulario label="Categoria" id={idCategoria}>
        <SelectCategorias
          id={idCategoria}
          value={selectedCategoriaId}
          onChange={(e) => setCategoriaId(Number(e.target.value))}
          categorias={categorias}
        />
      </CampoFormulario>
      <CampoFormulario label="Nombre" id={idNombre}>
        <InputTexto
          id={idNombre}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          required
        />
      </CampoFormulario>
      <CampoFormulario label="Descripcion" id={idDescripcion}>
        <AreaTexto
          id={idDescripcion}
          value={descripcion ?? ""}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripcion"
        />
      </CampoFormulario>
      <CampoFormulario label="Precio" id={idPrecio}>
        <InputTexto
          id={idPrecio}
          type="number"
          step="0.01"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="Precio"
          required
        />
      </CampoFormulario>
      <CampoFormulario label="URL imagen" id={idImagen}>
        <InputTexto
          id={idImagen}
          value={imagen ?? ""}
          onChange={(e) => setImagen(e.target.value)}
          placeholder="URL imagen"
        />
      </CampoFormulario>
      <label
        className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none"
      >
        <input
          type="checkbox"
          checked={disponible}
          onChange={(e) => setDisponible(e.target.checked)}
          className="rounded border border-border text-accent bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        Disponible
      </label>
      {error ? (
        <p className="text-sm font-medium text-foreground">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {submitting ? "Guardando..." : initial ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}
