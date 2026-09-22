import { Message } from "../types";

export function MessageBubble({ message }: { message: Message }) {
  return (
    <div className={`flex flex-col ${message.isSelf ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-md rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          message.isSelf
            ? "rounded-tr-none bg-indigo-600 text-white"
            : "rounded-tl-none bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
        }`}
      >
        <p>{message.content}</p>
      </div>
      <span className="mt-1 text-[11px] text-neutral-400">{message.createdAt}</span>
    </div>
  );
}

export function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}