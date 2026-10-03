import { notFound, redirect } from "next/navigation";
import { getSessionUserId } from "../../lib/session";
import { getChatDetails } from "../../features/chat/actions/chatActions";
import { ChatContainer } from "../../features/chat/components/ChatContainer";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  const userId = await getSessionUserId();

  if (!userId) redirect("/login");

  const details = await getChatDetails(chatId);
  if (!details) notFound();

  return (
    <ChatContainer
      chatId={chatId}
      user={details.otherUser}
      initialMessages={details.messages}
      currentUserId={userId}
    />
  );
}