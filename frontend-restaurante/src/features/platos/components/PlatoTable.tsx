"use client";

import type { Plato } from "@/features/platos/types";

function PlatoAcciones({
  plato,
  onEdit,
  onDelete,
}: {
  plato: Plato;
  onEdit: (plato: Plato) => void;
  onDelete: (plato: Plato) => void;
}) {
  return (
    <td className="px-4 py-2 text-right">
      <button
        onClick={() => onEdit(plato)}
        aria-label={`Editar ${plato.nombre}`}
        className="rounded bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Editar
      </button>
      <button
        onClick={() => onDelete(plato)}
        aria-label={`Eliminar ${plato.nombre}`}
        className="ml-2 rounded border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Eliminar
      </button>
    </td>
  );
}

function PlatoRow({
  plato,
  onEdit,
  onDelete,
}: {
  plato: Plato;
  onEdit: (plato: Plato) => void;
  onDelete: (plato: Plato) => void;
}) {
  const disponible = plato.disponible ? "Sí" : "No";
  return (
    <tr
      key={plato.id}
      className="border-t border-border transition hover:bg-accent/5"
    >
      <td className="px-4 py-2 font-medium text-foreground">{plato.nombre}</td>
      <td className="px-4 py-2 text-muted-foreground">
        {plato.categoria?.nombre ?? String(plato.categoria_id)}
      </td>
      <td className="px-4 py-2 text-foreground">
        {Number(plato.precio).toFixed(2)}
      </td>
      <td className="px-4 py-2 text-muted-foreground">{disponible}</td>
      <PlatoAcciones plato={plato} onEdit={onEdit} onDelete={onDelete} />
    </tr>
  );
}

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
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Nombre
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Categoria
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Precio
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Disponible
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((plato) => (
            <PlatoRow
              key={plato.id}
              plato={plato}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                Sin platos.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
