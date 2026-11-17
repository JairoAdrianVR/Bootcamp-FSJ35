"use client";

import type { Categoria } from "@/features/categorias/types";

export function CategoriaTable({
  items,
  onEdit,
  onDelete,
}: {
  items: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (categoria: Categoria) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Descripcion</th>
            <th className="px-4 py-2 text-left">Platos</th>
            <th className="px-4 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((categoria) => (
            <tr key={categoria.id} className="border-t border-zinc-200 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50">
              <td className="px-4 py-2 font-medium">{categoria.nombre}</td>
              <td className="px-4 py-2 text-zinc-500">{categoria.descripcion ?? "-"}</td>
              <td className="px-4 py-2">{categoria.platos_count ?? "-"}</td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() => onEdit(categoria)}
                  className="mr-2 text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(categoria)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-zinc-500">
                Sin categorias.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
