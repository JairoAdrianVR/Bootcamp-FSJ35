"use client";

import Link from "next/link";
import { useState } from "react";
import { Conversation } from "../types";
import { NewChatModal } from "./NewChatModal";
import { LogoutButton } from "../../auth/components/LogoutButton";

export function ChatSidebar({ conversations }: { conversations: Conversation[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <aside className="flex h-full w-80 flex-col border-r border-neutral-800 bg-neutral-900">
        {/* Cabecera con botón de nuevo chat */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-800 px-4">
          <h1 className="text-lg font-bold text-neutral-100">Mensajes</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            title="Nuevo mensaje"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300 transition hover:bg-indigo-600 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Lista de conversaciones */}
        <div className="flex-1 space-y-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-xs text-neutral-500">
              No tienes mensajes activos. Pulsa el botón <strong>+</strong> para iniciar uno.
            </div>
          ) : (
            conversations.map((chat) => (
              <Link
                key={chat.id}
                href={`/${chat.id}`}
                className="flex items-center gap-3 rounded-lg p-3 transition hover:bg-neutral-800/70"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.user.avatarUrl}
                    alt={chat.user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-neutral-900 ${
                      chat.user.status === "online" ? "bg-emerald-500" : "bg-neutral-500"
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm font-semibold text-neutral-100">
                      {chat.user.name}
                    </span>
                    <span className="text-[11px] text-neutral-500">{chat.updatedAt}</span>
                  </div>
                  <p className="truncate text-xs text-neutral-400">{chat.lastMessage}</p>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pie del Sidebar: Cerrar Sesión */}
        <div className="border-t border-neutral-800 p-2">
          <LogoutButton />
        </div>
      </aside>

      {/* Modal montado */}
      <NewChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}