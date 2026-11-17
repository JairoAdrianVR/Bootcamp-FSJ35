"use client";

import { useState, type FormEvent } from "react";
import type { Plato } from "@/features/platos/types";
import type { CreatePedidoInput } from "@/features/pedidos/types";

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
  const [mesa, setMesa] = useState("");
  const [notas, setNotas] = useState("");
  const [items, setItems] = useState<{ plato_id: number; cantidad: number }[]>([
    { plato_id: platos[0]?.id ?? 0, cantidad: 1 },
  ]);

  function updateItem(index: number, field: "plato_id" | "cantidad", value: number) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function addItem() {
    setItems((prev) => [...prev, { plato_id: platos[0]?.id ?? 0, cantidad: 1 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      mesa: mesa || null,
      notas: notas || null,
      items: items.map((i) => ({ plato_id: Number(i.plato_id), cantidad: Number(i.cantidad) })),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <h3 className="font-medium">Nuevo pedido</h3>
      <input
        value={mesa}
        onChange={(e) => setMesa(e.target.value)}
        placeholder="Mesa"
        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <textarea
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        placeholder="Notas"
        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Items</span>
          <button type="button" onClick={addItem} className="text-sm text-blue-600 hover:underline">
            + Agregar
          </button>
        </div>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <select
              value={item.plato_id}
              onChange={(e) => updateItem(index, "plato_id", Number(e.target.value))}
              className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              {platos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={item.cantidad}
              onChange={(e) => updateItem(index, "cantidad", Number(e.target.value))}
              className="w-20 rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-red-600 hover:underline"
            >
              x
            </button>
          </div>
        ))}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting || platos.length === 0}
        className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {submitting ? "Guardando..." : "Crear pedido"}
      </button>
    </form>
  );
}
