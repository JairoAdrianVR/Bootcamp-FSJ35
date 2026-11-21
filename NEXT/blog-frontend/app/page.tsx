'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, Post, getErrorMessage } from './lib/api';
import { useAuth } from './context/AuthContext';
import { AuthBox } from './components/AuthBox';
import  {PostForm}  from './components/PostForm';
import  {PostCard}  from './components/PostCard';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función reutilizable para recargar después de crear/editar/eliminar
  const reloadPosts = useCallback(async () => {
    try {
      const res = await api.getPosts();
      setPosts(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  // Carga inicial controlada
  useEffect(() => {
    let isMounted = true;

    const fetchInitialPosts = async () => {
      try {
        setLoading(true);
        const res = await api.getPosts();
        if (isMounted) {
          setPosts(res.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este post?')) return;
    try {
      await api.deletePost(id);
      await reloadPosts();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Login / Registro */}
      <AuthBox onError={setError} />

      {/* Formulario (solo visible si está autenticado) */}
{isAuthenticated && (
  <PostForm
    editingPost={editingPost}
    onSaved={() => {
      setEditingPost(null);
      reloadPosts();
    }}
    onCancelEdit={() => setEditingPost(null)}
    onError={setError}
  />
)}

      {/* Lista de Posts */}
      <section className="space-y-3">
        <h2 className="font-bold text-slate-800 text-lg">Publicaciones</h2>
        {loading ? (
          <p className="text-sm text-slate-400">Cargando...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-slate-400">No hay publicaciones.</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={setEditingPost}
              onDelete={handleDelete}
            />
          ))
        )}
      </section>
    </div>
  );
}