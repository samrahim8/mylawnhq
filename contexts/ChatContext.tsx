"use client";

import { createContext, useContext, ReactNode } from "react";
import { useChatHistory } from "@/hooks/useChatHistory";
import { ChatSession, ChatMessage } from "@/types";

interface ChatContextType {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;
  createSession: () => string;
  updateSession: (sessionId: string, messages: ChatMessage[]) => void;
  deleteSession: (sessionId: string) => void;
  recentSessions: {
    id: string;
    title: string;
    date: string;
    isActive: boolean;
  }[];
  isLoaded: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const chatHistory = useChatHistory();

  return (
    <ChatContext.Provider value={chatHistory}>{children}</ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
