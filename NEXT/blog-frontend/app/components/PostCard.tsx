'use client';

import { Post } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const { isAuthenticated } = useAuth();

  return (
    <article className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-slate-900">{post.title}</h3>
        <span className="text-xs bg-slate-100 text-black px-2 py-0.5 rounded">#{post.id}</span>
      </div>
      <p className="text-sm text-slate-700 whitespace-pre-line">{post.content}</p>
      <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-100">
        <span>Autor: {post.user?.name || `Usuario #${post.user_id}`}</span>
        {isAuthenticated && (
          <div className="flex gap-3">
            <button onClick={() => onEdit(post)} className="text-blue-600 hover:underline">
              Editar
            </button>
            <button onClick={() => onDelete(post.id)} className="text-red-600 hover:underline">
              Eliminar
            </button>
          </div>
        )}
      </div>
    </article>
  );
}