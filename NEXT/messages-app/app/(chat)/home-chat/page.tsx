export default function EmptyChatPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center p-6 text-neutral-400">
      <div className="rounded-full bg-neutral-100 p-4 dark:bg-neutral-800 mb-4">
        <svg className="h-8 w-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">No hay conversación seleccionada</h3>
      <p className="mt-1 text-sm text-neutral-500">Elige un chat de la lista izquierda para empezar a enviar mensajes.</p>
    </div>
  );
}
