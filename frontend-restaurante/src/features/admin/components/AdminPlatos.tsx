"use client";

import { PlatoForm, PlatoTable, type Plato } from "@/features/platos";
import { usePlatosAdmin } from "@/features/admin/hooks/usePlatosAdmin";

export function AdminPlatos() {
  const {
    items,
    categorias,
    loading,
    error,
    editing,
    showForm,
    submitting,
    formError,
    toggleForm,
    openEdit,
    save,
    remove,
  } = usePlatosAdmin();

  async function handleDelete(plato: Plato) {
    if (!confirm(`Eliminar plato "${plato.nombre}"?`)) return;
    const message = await remove(plato.id);
    if (message) alert(message);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Platos
          </h2>
          <p className="text-sm text-muted-foreground">
            Administra los platos de tu carta.
          </p>
        </div>
        <button
          onClick={toggleForm}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {showForm ? "Cerrar" : "+ Nuevo plato"}
        </button>
      </div>

      {showForm ? (
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm dark:bg-muted">
          <PlatoForm
            key={editing?.id ?? "new"}
            initial={editing}
            categorias={categorias}
            onSubmit={save}
            submitting={submitting}
            error={formError}
          />
        </div>
      ) : null}

      <div className="rounded-xl border border-border bg-background p-4 shadow-sm dark:bg-muted">
        {loading ? (
          <p className="p-4 text-sm text-muted-foreground">Cargando...</p>
        ) : error ? (
          <p className="p-4 text-sm font-medium text-foreground">{error}</p>
        ) : (
          <PlatoTable items={items} onEdit={openEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
