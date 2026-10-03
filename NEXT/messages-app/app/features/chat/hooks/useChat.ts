/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../repositories/client";
import { Message } from "../types";
import { sendMessageAction } from "../actions/chatActions";

export function useChat(chatId: string, initialMessages: Message[], currentUserId: string) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const supabase = createClient();

  useEffect(() => {
    setMessages(initialMessages);

    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMsg = payload.new as any;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [
              ...prev,
              {
                id: newMsg.id,
                chatId: newMsg.chat_id,
                senderId: newMsg.sender_id,
                content: newMsg.content,
                createdAt: new Date(newMsg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                isSelf: newMsg.sender_id === currentUserId,
              },
            ];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, initialMessages, currentUserId]);

  const sendMessage = async (text: string) => {
    await sendMessageAction(chatId, text);
  };

  return { messages, sendMessage };
}