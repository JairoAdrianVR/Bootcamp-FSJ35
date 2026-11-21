"use client";

import {
  PedidoDetailModal,
  PedidoForm,
  PedidoTable,
  type Pedido,
  type PedidoEstado,
} from "@/features/pedidos";
import { usePedidosAdmin } from "@/features/admin/hooks/usePedidosAdmin";

export function AdminPedidos() {
  const {
    items,
    platos,
    loading,
    error,
    showForm,
    submitting,
    formError,
    detalle,
    showModal,
    loadingDetalle,
    toggleForm,
    create,
    remove,
    cambiarEstado,
    verDetalle,
    closeModal,
  } = usePedidosAdmin();

  async function handleDelete(pedido: Pedido) {
    if (!confirm(`Eliminar pedido #${pedido.id}?`)) return;
    const message = await remove(pedido.id);
    if (message) alert(message);
  }

  async function handleCambiarEstado(pedido: Pedido, estado: PedidoEstado) {
    const message = await cambiarEstado(pedido, estado);
    if (message) alert(message);
  }

  async function handleVer(pedido: Pedido) {
    const message = await verDetalle(pedido);
    if (message) alert(message);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Pedidos
          </h2>
          <p className="text-sm text-muted-foreground">
            Controla el estado de las comandas del restaurante.
          </p>
        </div>
        <button
          onClick={toggleForm}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {showForm ? "Cerrar" : "+ Nuevo pedido"}
        </button>
      </div>

      {showForm ? (
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm dark:bg-muted">
          <PedidoForm
            platos={platos}
            onSubmit={create}
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
          <PedidoTable
            items={items}
            onVer={handleVer}
            onEliminar={handleDelete}
            onCambiarEstado={handleCambiarEstado}
          />
        )}
      </div>

      <PedidoDetailModal
        open={showModal}
        pedido={detalle}
        loading={loadingDetalle}
        onClose={closeModal}
      />
    </div>
  );
}
