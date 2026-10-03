//Modelos

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  status: "online" | "offline" | "away";
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isSelf: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  updatedAt: string;
}