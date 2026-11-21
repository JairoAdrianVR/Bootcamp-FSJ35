"use client";

import { CategoriaForm, CategoriaTable, type Categoria } from "@/features/categorias";
import { useCategoriasAdmin } from "@/features/admin/hooks/useCategoriasAdmin";

export function AdminCategorias() {
  const {
    items,
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
  } = useCategoriasAdmin();

  async function handleDelete(categoria: Categoria) {
    if (!confirm(`Eliminar categoria "${categoria.nombre}"?`)) return;
    const message = await remove(categoria.id);
    if (message) alert(message);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Categorias
          </h2>
          <p className="text-sm text-muted-foreground">
            Organiza los platos de tu carta por categorias.
          </p>
        </div>
        <button
          onClick={toggleForm}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {showForm ? "Cerrar" : "+ Nueva categoria"}
        </button>
      </div>

      {showForm ? (
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm dark:bg-muted">
          <CategoriaForm
            key={editing?.id ?? "new"}
            initial={editing}
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
          <CategoriaTable items={items} onEdit={openEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
