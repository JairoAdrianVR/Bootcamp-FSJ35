import Link from "next/link";
import { Conversation } from "../types";

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    user: { id: "u1", name: "Alex Rivera", avatarUrl: "https://i.pravatar.cc/150?u=u1", status: "online" },
    lastMessage: "Confirmado el deploy para hoy.",
    updatedAt: "10:42 AM",
    unreadCount: 2,
  },
  {
    id: "2",
    user: { id: "u2", name: "Sara Morales", avatarUrl: "https://i.pravatar.cc/150?u=u2", status: "offline" },
    lastMessage: "¿Pudiste revisar el último endpoint?",
    updatedAt: "Ayer",
  },
];

export function ChatSidebar() {
  return (
    <aside className="flex h-full w-80 flex-col border-r border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
      {/* Header del sidebar */}
      <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
        <h1 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Mensajes</h1>
        <button className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="p-3">
        <input
          type="text"
          placeholder="Buscar conversación..."
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-indigo-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        />
      </div>

      {/* Lista de chats */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {MOCK_CONVERSATIONS.map((chat) => (
          <Link
            key={chat.id}
            href={`/${chat.id}`}
            className="flex items-center gap-3 rounded-lg p-3 transition hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60"
          >
            <div className="relative flex-shrink-0">
              <img src={chat.user.avatarUrl} alt={chat.user.name} className="h-10 w-10 rounded-full object-cover" />
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-neutral-900 ${
                  chat.user.status === "online" ? "bg-emerald-500" : "bg-neutral-400"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {chat.user.name}
                </span>
                <span className="text-xs text-neutral-400">{chat.updatedAt}</span>
              </div>
              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{chat.lastMessage}</p>
            </div>
            {chat.unreadCount && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {chat.unreadCount}
              </span>
            )}
          </Link>
        ))}
      </div>
    </aside>
  );
}