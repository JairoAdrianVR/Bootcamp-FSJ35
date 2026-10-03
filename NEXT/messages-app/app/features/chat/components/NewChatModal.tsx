"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../types";
import { getRegisteredUsers, createOrGetChat } from "../actions/chatActions";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewChatModal({ isOpen, onClose }: NewChatModalProps) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [startingChat, setStartingChat] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getRegisteredUsers()
        .then((data) => setUsers(data))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectUser = async (targetUserId: string) => {
    try {
      setStartingChat(targetUserId);
      const chatId = await createOrGetChat(targetUserId);
      onClose();
      router.push(`/${chatId}`);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setStartingChat(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <h2 className="text-base font-semibold text-white">Nueva conversación</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 max-h-72 overflow-y-auto space-y-1">
          {loading ? (
            <p className="text-center text-xs text-neutral-500 py-6">Buscando usuarios...</p>
          ) : users.length === 0 ? (
            <p className="text-center text-xs text-neutral-500 py-6">
              No hay otros usuarios registrados aún.
            </p>
          ) : (
            users.map((u) => (
              <button
                key={u.id}
                disabled={startingChat === u.id}
                onClick={() => handleSelectUser(u.id)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-800/80 transition text-left disabled:opacity-50"
              >
                <img
                  src={u.avatarUrl}
                  alt={u.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-200">{u.name}</p>
                  <span className="text-[11px] text-emerald-500 capitalize">{u.status}</span>
                </div>
                {startingChat === u.id && (
                  <span className="text-xs text-indigo-400">Abriendo...</span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}