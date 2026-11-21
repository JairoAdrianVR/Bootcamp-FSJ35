"use client";

import { useId, useState, type FormEvent } from "react";
import type { Categoria, CreateCategoriaInput } from "@/features/categorias/types";

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
  value,
  onChange,
  placeholder,
  required,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <input
      id={id}
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
  const idNombre = useId();
  const idDescripcion = useId();

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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-border p-6 bg-background dark:bg-muted"
    >
      <h3 className="font-display text-lg font-semibold text-foreground">
        {initial ? "Editar categoria" : "Nueva categoria"}
      </h3>
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
