import { redirect } from "next/navigation";
import { getSessionUserId } from "../lib/session";
import { getConversations } from "../features/chat/actions/chatActions";
import { ChatSidebar } from "../features/chat/components/ChatSidebar";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const conversations = await getConversations();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ChatSidebar conversations={conversations}/>
      <section className="flex flex-1 flex-col overflow-hidden">{children}</section>
    </div>
  );
}

// Route::put("/posts/{id}")

// controller -> param -> id