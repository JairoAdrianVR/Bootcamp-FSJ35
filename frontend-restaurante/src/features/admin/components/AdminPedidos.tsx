"use client";

import { useCallback, useEffect, useState } from "react";
import { pedidosService } from "@/features/pedidos/services/pedidos.service";
import { platosService } from "@/features/platos/services/platos.service";
import { PedidoTable } from "@/features/pedidos/components/PedidoTable";
import { PedidoForm } from "@/features/pedidos/components/PedidoForm";
import { PedidoDetailModal } from "@/features/pedidos/components/PedidoDetailModal";
import type { Pedido } from "@/features/pedidos/types";
import type { Plato } from "@/features/platos/types";
import { ApiError } from "@/shared/types/api";

export function AdminPedidos() {
  const [items, setItems] = useState<Pedido[]>([]);
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [detalle, setDetalle] = useState<Pedido | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pedidosRes, platosRes] = await Promise.all([
        pedidosService.list(),
        platosService.list(),
      ]);
      setItems(pedidosRes.data);
      setPlatos(platosRes.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [pedidosRes, platosRes] = await Promise.all([
          pedidosService.list(),
          platosService.list(),
        ]);
        if (active) {
          setItems(pedidosRes.data);
          setPlatos(platosRes.data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof ApiError ? err.message : "No se pudieron cargar los pedidos.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function handleCreate(input: Parameters<typeof pedidosService.create>[0]) {
    setSubmitting(true);
    setFormError(null);
    try {
      await pedidosService.create(input);
      setShowForm(false);
      await load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No se pudo crear el pedido.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(pedido: Pedido) {
    if (!confirm(`Eliminar pedido #${pedido.id}?`)) return;
    try {
      await pedidosService.remove(pedido.id);
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "No se pudo eliminar.");
    }
  }

  async function handleCambiarEstado(pedido: Pedido, estado: Pedido["estado"]) {
    try {
      await pedidosService.update(pedido.id, { estado });
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "No se pudo actualizar.");
    }
  }

  async function handleVer(pedido: Pedido) {
    setShowModal(true);
    setLoadingDetalle(true);
    setDetalle(null);
    try {
      const full = await pedidosService.get(pedido.id);
      setDetalle(full);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "No se pudo obtener.");
      setShowModal(false);
    } finally {
      setLoadingDetalle(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pedidos</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Controla el estado de las comandas del restaurante.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90"
        >
          {showForm ? "Cerrar" : "+ Nuevo pedido"}
        </button>
      </div>

      {showForm ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <PedidoForm
            platos={platos}
            onSubmit={handleCreate}
            submitting={submitting}
            error={formError}
          />
        </div>
      ) : null}

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {loading ? (
          <p className="p-4 text-sm text-zinc-500">Cargando...</p>
        ) : error ? (
          <p className="p-4 text-sm text-red-600">{error}</p>
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
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
