import { ChatHeader } from "../../features/chat/components/ChatHeader"";
import { MessageList } from "../../features/chat/components/ChatHeader"";
import { MessageInput } from "@/features/chat/components/MessageInput";
import { Message, User } from "@/features/chat/types";

const MOCK_USER: User = {
  id: "u1",
  name: "Alex Rivera",
  avatarUrl: "https://i.pravatar.cc/150?u=u1",
  status: "online",
};

const MOCK_MESSAGES: Message[] = [
  { id: "m1", senderId: "u1", content: "Hola, ¿cómo va el progreso con Next.js?", createdAt: "10:30 AM", isSelf: false },
  { id: "m2", senderId: "me", content: "¡Muy bien! Acabamos de estructurar toda la maquetación modular con Tailwind.", createdAt: "10:32 AM", isSelf: true },
  { id: "m3", senderId: "u1", content: "Excelente, queda listo para enganchar Supabase en la Fase 2.", createdAt: "10:35 AM", isSelf: false },
];

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  return (
    <div className="flex h-full flex-col">
      <ChatHeader user={MOCK_USER} />
      <MessageList messages={MOCK_MESSAGES} />
      <MessageInput />
    </div>
  );
}