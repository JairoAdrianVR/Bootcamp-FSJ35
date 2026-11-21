"use client";

import type { Categoria } from "@/features/categorias/types";

function CategoriaAcciones({
  categoria,
  onEdit,
  onDelete,
}: {
  categoria: Categoria;
  onEdit: (categoria: Categoria) => void;
  onDelete: (categoria: Categoria) => void;
}) {
  return (
    <td className="px-4 py-2 text-right">
      <button
        onClick={() => onEdit(categoria)}
        aria-label={`Editar ${categoria.nombre}`}
        className="rounded bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Editar
      </button>
      <button
        onClick={() => onDelete(categoria)}
        aria-label={`Eliminar ${categoria.nombre}`}
        className="ml-2 rounded border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Eliminar
      </button>
    </td>
  );
}

function CategoriaRow({
  categoria,
  onEdit,
  onDelete,
}: {
  categoria: Categoria;
  onEdit: (categoria: Categoria) => void;
  onDelete: (categoria: Categoria) => void;
}) {
  return (
    <tr
      key={categoria.id}
      className="border-t border-border transition hover:bg-accent/5"
    >
      <td className="px-4 py-2 font-medium text-foreground">{categoria.nombre}</td>
      <td className="px-4 py-2 text-muted-foreground">
        {categoria.descripcion ?? "-"}
      </td>
      <td className="px-4 py-2 text-foreground">
        {categoria.platos_count ?? "-"}
      </td>
      <CategoriaAcciones
        categoria={categoria}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </tr>
  );
}

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
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Nombre
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Descripcion
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Platos
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((categoria) => (
            <CategoriaRow
              key={categoria.id}
              categoria={categoria}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                Sin categorias.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
