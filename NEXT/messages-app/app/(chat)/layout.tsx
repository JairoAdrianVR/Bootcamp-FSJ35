import { ChatSidebar } from "../features/chat/components/ChatSidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen w-screen overflow-hidden bg-white antialiased dark:bg-neutral-950">
      <ChatSidebar />
      <section className="flex flex-1 flex-col overflow-hidden">
        {children}
      </section>
    </main>
  );
}
// Route::put("/posts/{id}")

// controller -> param -> id