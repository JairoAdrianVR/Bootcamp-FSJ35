/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { api, Post, getErrorMessage } from '../lib/api';

interface PostFormProps {
  editingPost: Post | null;
  onSaved?: () => void;
  onSuccess?: () => void;
  onCancelEdit: () => void;
  onError: (msg: string | null) => void;
}

export function PostForm({
  editingPost,
  onSaved,
  onSuccess,
  onCancelEdit,
  onError,
}: PostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [restoreId, setRestoreId] = useState('');
  const [loading, setLoading] = useState(false);

  // Sincroniza los campos cuando se selecciona un post para editar
  useEffect(() => {
    if (editingPost) {

      setTitle(editingPost.title);
      setContent(editingPost.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editingPost]);

  // Ejecuta la función de callback disponible
  const triggerSuccessCallback = () => {
    if (onSaved) {
      onSaved();
    } else if (onSuccess) {
      onSuccess();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onError(null);
    setLoading(true);

    try {
      if (editingPost) {
        await api.updatePost(editingPost.id, { title, content });
      } else {
        await api.createPost({ title, content });
      }

      setTitle('');
      setContent('');
      triggerSuccessCallback();
    } catch (err) {
      onError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreId) return;

    onError(null);
    setLoading(true);

    try {
      await api.restorePost(Number(restoreId));
      setRestoreId('');
      triggerSuccessCallback();
    } catch (err) {
      onError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
      <h2 className="font-bold text-slate-800">
        {editingPost ? 'Editar Post' : 'Nuevo Post'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
          required
          disabled={loading}
        />

        <textarea
          placeholder="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm h-24 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
          required
          disabled={loading}
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-md font-medium transition text-black"
          >
            {loading ? 'Guardando...' : editingPost ? 'Guardar Cambios' : 'Publicar'}
          </button>

          {editingPost && (
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={loading}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm px-4 py-2 rounded-md transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Restaurar Post Eliminado (Soft Delete) */}
      <div className="pt-3 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-600 mb-2">Restaurar post eliminado:</p>
        <form onSubmit={handleRestore} className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="ID del post"
            value={restoreId}
            onChange={(e) => setRestoreId(e.target.value)}
            className="w-36 border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !restoreId}
            className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded-md font-medium transition"
          >
            Restaurar
          </button>
        </form>
      </div>
    </div>
  );
}