"use client";

import { useCallback, useEffect, useState } from "react";
import {
  pedidosService,
  type CreatePedidoInput,
  type Pedido,
  type PedidoEstado,
} from "@/features/pedidos";
import { platosService, type Plato } from "@/features/platos";
import { getErrorMessage } from "@/shared/lib/errors";

const LOAD_ERROR = "No se pudieron cargar los pedidos.";

interface PedidosAdminData {
  items: Pedido[];
  platos: Plato[];
}

async function fetchPedidosAdminData(): Promise<PedidosAdminData> {
  const [pedidosRes, platosRes] = await Promise.all([
    pedidosService.list(),
    platosService.list(),
  ]);
  return { items: pedidosRes.data, platos: platosRes.data };
}

export interface UsePedidosAdminResult {
  items: Pedido[];
  platos: Plato[];
  loading: boolean;
  error: string | null;
  showForm: boolean;
  submitting: boolean;
  formError: string | null;
  detalle: Pedido | null;
  showModal: boolean;
  loadingDetalle: boolean;
  /** Abre el formulario de creación o lo cierra si ya estaba abierto. */
  toggleForm: () => void;
  /** Crea el pedido, cierra el formulario y recarga la lista. */
  create: (input: CreatePedidoInput) => Promise<void>;
  /** Elimina y recarga. Devuelve el mensaje de error o `null` si fue bien. */
  remove: (id: number) => Promise<string | null>;
  /** Cambia el estado y recarga. Devuelve el mensaje de error o `null`. */
  cambiarEstado: (pedido: Pedido, estado: PedidoEstado) => Promise<string | null>;
  /** Abre el modal y carga el detalle. Devuelve el mensaje de error o `null`. */
  verDetalle: (pedido: Pedido) => Promise<string | null>;
  closeModal: () => void;
}

/**
 * Estado y operaciones del panel de pedidos (listado, alta, estado y detalle).
 */
export function usePedidosAdmin(): UsePedidosAdminResult {
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

  const applyData = useCallback((data: PedidosAdminData) => {
    setItems(data.items);
    setPlatos(data.platos);
  }, []);

  const reload = useCallback(
    () =>
      fetchPedidosAdminData().then(
        (data) => {
          applyData(data);
          setError(null);
          setLoading(false);
        },
        (err: unknown) => {
          setError(getErrorMessage(err, LOAD_ERROR));
          setLoading(false);
        },
      ),
    [applyData],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  function toggleForm() {
    setShowForm((open) => !open);
  }

  async function create(input: CreatePedidoInput) {
    setSubmitting(true);
    setFormError(null);
    try {
      await pedidosService.create(input);
      setShowForm(false);
      setLoading(true);
      await reload();
    } catch (err) {
      setFormError(getErrorMessage(err, "No se pudo crear el pedido."));
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: number): Promise<string | null> {
    try {
      await pedidosService.remove(id);
      setLoading(true);
      await reload();
      return null;
    } catch (err) {
      return getErrorMessage(err, "No se pudo eliminar.");
    }
  }

  async function cambiarEstado(pedido: Pedido, estado: PedidoEstado): Promise<string | null> {
    try {
      await pedidosService.update(pedido.id, { estado });
      setLoading(true);
      await reload();
      return null;
    } catch (err) {
      return getErrorMessage(err, "No se pudo actualizar.");
    }
  }

  async function verDetalle(pedido: Pedido): Promise<string | null> {
    setShowModal(true);
    setLoadingDetalle(true);
    setDetalle(null);
    try {
      const full = await pedidosService.get(pedido.id);
      setDetalle(full);
      return null;
    } catch (err) {
      setShowModal(false);
      return getErrorMessage(err, "No se pudo obtener.");
    } finally {
      setLoadingDetalle(false);
    }
  }

  function closeModal() {
    setShowModal(false);
  }

  return {
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
  };
}
