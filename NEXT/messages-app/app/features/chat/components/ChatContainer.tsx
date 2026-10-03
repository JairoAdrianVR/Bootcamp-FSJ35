"use client";

import { useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import { Message, User } from "../types";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageBubble";
import { MessageInput } from "./MessageInput";

interface ChatContainerProps {
  chatId: string;
  user: User;
  initialMessages: Message[];
  currentUserId: string;
}

export function ChatContainer({
  chatId,
  user,
  initialMessages,
  currentUserId,
}: ChatContainerProps) {
  const { messages, sendMessage } = useChat(chatId, initialMessages, currentUserId);

const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (containerRef.current) {
    containerRef.current.scrollTop = 0;
  }
}, [messages]);

  return (
    <div className="flex h-full flex-col bg-neutral-950">
      <ChatHeader user={user} />
      <MessageList messages={messages} />
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
}