"use client";

import type { Plato } from "@/features/platos/types";

export function PlatoTable({
  items,
  onEdit,
  onDelete,
}: {
  items: Plato[];
  onEdit: (plato: Plato) => void;
  onDelete: (plato: Plato) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Categoria</th>
            <th className="px-4 py-2 text-left">Precio</th>
            <th className="px-4 py-2 text-left">Disponible</th>
            <th className="px-4 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((plato) => (
            <tr key={plato.id} className="border-t border-zinc-200 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50">
              <td className="px-4 py-2 font-medium">{plato.nombre}</td>
              <td className="px-4 py-2 text-zinc-500">{plato.categoria?.nombre ?? plato.categoria_id}</td>
              <td className="px-4 py-2">{Number(plato.precio).toFixed(2)}</td>
              <td className="px-4 py-2">{plato.disponible ? "Si" : "No"}</td>
              <td className="px-4 py-2 text-right">
                <button onClick={() => onEdit(plato)} className="mr-2 text-blue-600 hover:underline">
                  Editar
                </button>
                <button onClick={() => onDelete(plato)} className="text-red-600 hover:underline">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-zinc-500">
                Sin platos.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
