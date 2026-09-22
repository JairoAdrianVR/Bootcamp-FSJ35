import { User } from "../types";

export function ChatHeader({ user }: { user: User }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center gap-3">
        <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
        <div>
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{user.name}</h2>
          <span className="text-xs text-emerald-500 capitalize">{user.status}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </header>
  );
}