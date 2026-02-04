"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatSession, ChatMessage } from "@/types";

const STORAGE_KEY = "lawnhq_chat_sessions";
const MAX_SESSIONS = 20;

function generateTitle(messages: ChatMessage[]): string {
  // Get the first user message to create a title
  const firstUserMessage = messages.find((m) => m.role === "user");
  if (!firstUserMessage) return "New conversation";

  // Truncate to ~30 chars and add ellipsis if needed
  const content = firstUserMessage.content.trim();
  if (content.length <= 30) return content;
  return content.slice(0, 30).trim() + "...";
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load sessions from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatSession[];
        setSessions(parsed);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save sessions to localStorage
  const saveSessions = useCallback((newSessions: ChatSession[]) => {
    if (typeof window === "undefined") return;

    // Keep only the most recent sessions
    const trimmed = newSessions.slice(0, MAX_SESSIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    setSessions(trimmed);
  }, []);

  // Create a new chat session
  const createSession = useCallback((): string => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New conversation",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newSessions = [newSession, ...sessions];
    saveSessions(newSessions);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  }, [sessions, saveSessions]);

  // Get the current session
  const currentSession = sessions.find((s) => s.id === currentSessionId) || null;

  // Update a session with new messages
  const updateSession = useCallback(
    (sessionId: string, messages: ChatMessage[]) => {
      const newSessions = sessions.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages,
            title: generateTitle(messages),
            updatedAt: new Date().toISOString(),
          };
        }
        return session;
      });

      // Sort by most recent
      newSessions.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      saveSessions(newSessions);
    },
    [sessions, saveSessions]
  );

  // Delete a session
  const deleteSession = useCallback(
    (sessionId: string) => {
      const newSessions = sessions.filter((s) => s.id !== sessionId);
      saveSessions(newSessions);

      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
      }
    },
    [sessions, saveSessions, currentSessionId]
  );

  // Get recent sessions for sidebar (4 most recent)
  const recentSessions = sessions.slice(0, 4).map((session) => ({
    id: session.id,
    title: session.title,
    date: formatRelativeDate(session.updatedAt),
    isActive: session.id === currentSessionId,
  }));

  return {
    sessions,
    currentSession,
    currentSessionId,
    setCurrentSessionId,
    createSession,
    updateSession,
    deleteSession,
    recentSessions,
    isLoaded,
  };
}
