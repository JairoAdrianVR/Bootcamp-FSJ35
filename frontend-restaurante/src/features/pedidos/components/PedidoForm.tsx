"use client";

import { useId, useState, type FormEvent } from "react";
import type { Plato } from "@/features/platos/types";
import type { CreatePedidoInput } from "@/features/pedidos/types";

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
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
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

function SelectPlato({
  id,
  value,
  onChange,
  platos,
}: {
  id: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  platos: Plato[];
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground dark:bg-muted dark:text-foreground dark:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {platos.map((p) => (
        <option key={p.id} value={p.id}>
          {p.nombre}
        </option>
      ))}
    </select>
  );
}

function InputCantidad({
  id,
  value,
  onChange,
}: {
  id: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      id={id}
      type="number"
      min={1}
      value={value}
      onChange={onChange}
      className="w-20 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground dark:bg-muted dark:text-foreground dark:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    />
  );
}

function BotonEliminarItem({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded border border-border px-2 py-2.5 text-sm text-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label="Eliminar item"
    >
      x
    </button>
  );
}

/**
 * Un item sin plato asignado (`null`) o cuyo plato ya no existe se resuelve
 * siempre contra la lista actual de platos, para no enviar `plato_id: 0`.
 */
function resolvePlatoId(platoId: number | null, platos: Plato[]): number | null {
  if (platos.length === 0) return null;
  if (platoId !== null && platos.some((plato) => plato.id === platoId)) return platoId;
  return platos[0]?.id ?? null;
}

function PedidoItemFila({
  item,
  index,
  platos,
  updateItem,
  removeItem,
}: {
  item: { plato_id: number | null; cantidad: number };
  index: number;
  platos: Plato[];
  updateItem: (index: number, field: "plato_id" | "cantidad", value: number) => void;
  removeItem: (index: number) => void;
}) {
  const idPlato = useId();
  const idCantidad = useId();
  const platoId = resolvePlatoId(item.plato_id, platos);
  return (
    <div key={index} className="flex gap-2">
      <SelectPlato
        id={idPlato}
        value={platoId ?? 0}
        onChange={(e) => updateItem(index, "plato_id", Number(e.target.value))}
        platos={platos}
      />
      <InputCantidad
        id={idCantidad}
        value={item.cantidad}
        onChange={(e) => updateItem(index, "cantidad", Number(e.target.value))}
      />
      <BotonEliminarItem onClick={() => removeItem(index)} />
    </div>
  );
}

export function PedidoForm({
  platos,
  onSubmit,
  submitting,
  error,
}: {
  platos: Plato[];
  onSubmit: (input: CreatePedidoInput) => Promise<void>;
  submitting: boolean;
  error: string | null;
}) {
  const idMesa = useId();
  const idNotas = useId();

  const [mesa, setMesa] = useState("");
  const [notas, setNotas] = useState("");
  const [items, setItems] = useState<{ plato_id: number | null; cantidad: number }[]>([
    { plato_id: null, cantidad: 1 },
  ]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const mensajeError = error ?? validationError;

  function updateItem(index: number, field: "plato_id" | "cantidad", value: number) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function addItem() {
    if (platos.length === 0) return;
    setItems((prev) => [...prev, { plato_id: null, cantidad: 1 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedItems = items.flatMap((item) => {
      const platoId = resolvePlatoId(item.plato_id, platos);
      if (platoId === null || platoId <= 0) return [];
      const cantidad = Number(item.cantidad);
      return [
        {
          plato_id: platoId,
          cantidad: Number.isFinite(cantidad) && cantidad >= 1 ? Math.floor(cantidad) : 1,
        },
      ];
    });

    if (normalizedItems.length === 0) {
      setValidationError("Añade al menos un plato al pedido.");
      return;
    }

    setValidationError(null);
    await onSubmit({
      mesa: mesa || null,
      notas: notas || null,
      items: normalizedItems,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-border p-6 bg-background dark:bg-muted"
    >
      <h3 className="font-display text-lg font-semibold text-foreground">Nuevo pedido</h3>
      <CampoFormulario label="Mesa" id={idMesa}>
        <InputTexto
          id={idMesa}
          value={mesa}
          onChange={(e) => setMesa(e.target.value)}
          placeholder="Mesa"
        />
      </CampoFormulario>
      <CampoFormulario label="Notas" id={idNotas}>
        <AreaTexto
          id={idNotas}
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Notas"
        />
      </CampoFormulario>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Items</span>
          <button
            type="button"
            onClick={addItem}
            className="rounded border border-border px-3 py-1.5 text-xs font-medium text-accent-foreground bg-accent transition hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            + Agregar
          </button>
        </div>
        {items.map((item, index) => (
          <PedidoItemFila
            key={index}
            item={item}
            index={index}
            platos={platos}
            updateItem={updateItem}
            removeItem={removeItem}
          />
        ))}
      </div>
      {mensajeError ? (
        <p className="text-sm font-medium text-foreground">{mensajeError}</p>
      ) : null}
      <button
        type="submit"
        disabled={submitting || platos.length === 0}
        className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {submitting ? "Guardando..." : "Crear pedido"}
      </button>
    </form>
  );
}
