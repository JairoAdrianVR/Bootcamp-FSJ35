export function MessageInput() {
  return (
    <footer className="border-t border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:bg-neutral-900"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
        >
          Enviar
        </button>
      </form>
    </footer>
  );
}