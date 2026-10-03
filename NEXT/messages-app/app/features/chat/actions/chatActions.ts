"use server";

import { supabaseAdmin } from "../../../repositories/supabase";
import { getSessionUserId } from "../../../lib/session";
import { Conversation, Message, User } from "../types";

export async function getConversations(): Promise<Conversation[]> {
  const currentUserId = await getSessionUserId();
  if (!currentUserId) return [];

  const { data: myChats } = await supabaseAdmin
    .from("chat_participants")
    .select("chat_id")
    .eq("user_id", currentUserId);

  if (!myChats || myChats.length === 0) return [];
  const chatIds = myChats.map((c) => c.chat_id);

  const { data: participants } = await supabaseAdmin
    .from("chat_participants")
    .select("chat_id, user_id")
    .in("chat_id", chatIds)
    .neq("user_id", currentUserId);

  if (!participants || participants.length === 0) return [];

  const otherUserIds = participants.map((p) => p.user_id);
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, name, avatarUrl, status")
    .in("id", otherUserIds);

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

  const { data: messages } = await supabaseAdmin
    .from("messages")
    .select("chat_id, content, created_at")
    .in("chat_id", chatIds)
    .order("created_at", { ascending: false });

  return participants
    .map((p) => {
      const userProfile = profileMap.get(p.user_id);
      if (!userProfile) return null;

      const lastMsg = messages?.find((m) => m.chat_id === p.chat_id);

      return {
        id: p.chat_id,
        user: {
          id: String(userProfile.id),
          name: userProfile.name,
          avatarUrl:
            userProfile.avatar_url ||
            `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userProfile.name)}`,
          status: userProfile.status || "offline",
        },
        lastMessage: lastMsg ? lastMsg.content : "Sin mensajes aún",
        updatedAt: lastMsg
          ? new Date(lastMsg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      };
    })
    .filter(Boolean) as Conversation[];
}

export async function getChatDetails(chatId: string): Promise<{ otherUser: User; messages: Message[] } | null> {
  const currentUserId = await getSessionUserId();
  if (!currentUserId) return null;

  const { data: participantData } = await supabaseAdmin
    .from("chat_participants")
    .select("user_id")
    .eq("chat_id", chatId)
    .neq("user_id", currentUserId)
    .maybeSingle();

  if (!participantData) return null;

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("id, name, avatarUrl, status")
    .eq("id", participantData.user_id)
    .maybeSingle();

  if (error || !profile) return null;

  const { data: rawMessages } = await supabaseAdmin
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  const messages: Message[] = (rawMessages || []).map((m: any) => ({
    id: String(m.id),
    chatId: String(m.chat_id),
    senderId: String(m.sender_id),
    content: m.content,
    createdAt: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    isSelf: String(m.sender_id) === String(currentUserId),
  }));

  return {
    otherUser: {
      id: String(profile.id),
      name: profile.name,
      avatarUrl: profile.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(profile.name)}`,
      status: profile.status || "offline",
    },
    messages,
  };
}

export async function sendMessageAction(chatId: string, content: string) {
  const currentUserId = await getSessionUserId();
  if (!currentUserId || !content.trim()) return { error: "No autorizado o texto vacío" };

  const { error } = await supabaseAdmin.from("messages").insert({
    chat_id: chatId,
    sender_id: currentUserId,
    content: content.trim(),
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function getRegisteredUsers(): Promise<User[]> {
  const currentUserId = await getSessionUserId();
  if (!currentUserId) return [];

  const { data: users } = await supabaseAdmin
    .from("profiles")
    .select("id, name, avatarUrl, status")
    .neq("id", currentUserId)
    .order("name", { ascending: true });

  return (users || []).map((u: any) => ({
    id: u.id,
    name: u.name,
    avatarUrl: u.avatar_url,
    status: u.status,
  }));
}


export async function createOrGetChat(targetUserId: string): Promise<string> {
  const currentUserId = await getSessionUserId();
  if (!currentUserId) throw new Error("No autenticado");

  const { data: myChats } = await supabaseAdmin
    .from("chat_participants")
    .select("chat_id")
    .eq("user_id", currentUserId);

  if (myChats && myChats.length > 0) {
    const chatIds = myChats.map((c) => c.chat_id);

    const { data: sharedChat } = await supabaseAdmin
      .from("chat_participants")
      .select("chat_id")
      .eq("user_id", targetUserId)
      .in("chat_id", chatIds)
      .maybeSingle();

    if (sharedChat) {
      return sharedChat.chat_id;
    }
  }

  const { data: newChat, error: chatError } = await supabaseAdmin
    .from("chats")
    .insert({})
    .select("id")
    .single();

  if (chatError || !newChat) {
    throw new Error("Error al inicializar la conversación");
  }

  await supabaseAdmin.from("chat_participants").insert([
    { chat_id: newChat.id, user_id: currentUserId },
    { chat_id: newChat.id, user_id: targetUserId },
  ]);

  return newChat.id;
}