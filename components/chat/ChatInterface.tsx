"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types";
import { useProfile } from "@/hooks/useProfile";
import { useCalendar } from "@/hooks/useCalendar";
import { useWeather } from "@/hooks/useWeather";
import { useChatContext } from "@/contexts/ChatContext";

interface ChatInterfaceProps {
  initialMessage?: string;
}

export default function ChatInterface({ initialMessage }: ChatInterfaceProps) {
  const { profile } = useProfile();
  const { activities } = useCalendar();
  const { weather } = useWeather(profile?.zipCode);
  const {
    currentSession,
    currentSessionId,
    createSession,
    updateSession,
    isLoaded,
  } = useChatContext();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialMessageProcessed = useRef(false);
  const sessionInitialized = useRef(false);

  // Load messages from current session when it changes
  useEffect(() => {
    if (currentSession) {
      setMessages(currentSession.messages);
      sessionInitialized.current = true;
    } else if (isLoaded && !currentSessionId) {
      // No session selected, start fresh
      setMessages([]);
      sessionInitialized.current = false;
    }
  }, [currentSession, currentSessionId, isLoaded]);

  // Handle initial message from URL query
  useEffect(() => {
    if (initialMessage && !initialMessageProcessed.current && isLoaded && messages.length === 0) {
      initialMessageProcessed.current = true;
      handleSend(initialMessage);
    }
  }, [initialMessage, isLoaded, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    // Create a new session if we don't have one
    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = createSession();
    }

    const isTodayPrompt = text.toLowerCase().includes("what should i do today");

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Save immediately with user message
    updateSession(sessionId, newMessages);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const requestBody: {
        messages: { role: string; content: string }[];
        profile: typeof profile;
        weatherContext?: typeof weather;
        activitiesContext?: typeof activities;
      } = {
        messages: newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        profile: profile || null,
      };

      if (isTodayPrompt) {
        if (weather) {
          requestBody.weatherContext = weather;
        }
        if (activities && activities.length > 0) {
          requestBody.activitiesContext = activities;
        }
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      updateSession(sessionId, updatedMessages);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);
      updateSession(sessionId, updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content: string) => {
    return content
      .split("\n")
      .map((line) => {
        line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        if (line.startsWith("# ")) {
          return `<h3 class="text-lg font-semibold text-neutral-900 mt-4 mb-2">${line.slice(2)}</h3>`;
        }
        if (line.startsWith("## ")) {
          return `<h4 class="text-base font-medium text-neutral-900 mt-3 mb-1">${line.slice(3)}</h4>`;
        }
        if (line.match(/^\d+\./)) {
          return `<p class="ml-4 my-1">${line}</p>`;
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return `<p class="ml-4 my-1">• ${line.slice(2)}</p>`;
        }
        if (line.trim()) {
          return `<p class="my-1">${line}</p>`;
        }
        return "<br/>";
      })
      .join("");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-16 h-16 bg-[#6b7a5d] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h1 className="text-3xl font-semibold text-neutral-900 mb-2">
                Let&apos;s talk grass.
              </h1>
              <p className="text-neutral-500 mb-10">
                No question too basic.
              </p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {[
                  "My grass looks kinda yellow",
                  "When should I put down fertilizer?",
                  "What's this weed in my yard?",
                  "Is it too hot to mow today?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSend(suggestion)}
                    className="p-4 text-left text-sm bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] ${
                      message.role === "user"
                        ? "bg-[#6b7a5d] text-white rounded-2xl rounded-br-md px-4 py-3"
                        : "bg-neutral-100 text-neutral-900 rounded-2xl rounded-bl-md px-4 py-3"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div
                        className="leading-relaxed prose prose-sm max-w-none prose-p:text-neutral-700 prose-headings:text-neutral-900"
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                      />
                    ) : (
                      <p className="leading-relaxed">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input area - fixed at bottom, centered */}
      <div className="border-t border-neutral-100 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="relative flex items-end bg-neutral-50 border border-neutral-200 rounded-2xl focus-within:border-neutral-400 focus-within:ring-1 focus-within:ring-neutral-400 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's going on with your lawn?"
              rows={1}
              className="flex-1 bg-transparent text-base text-neutral-900 placeholder-neutral-400 outline-none resize-none py-4 px-4 max-h-[200px]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={`m-2 p-2 rounded-xl transition-all ${
                input.trim() && !isLoading
                  ? "bg-[#6b7a5d] hover:bg-[#5a6950] text-white"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-neutral-400 text-center mt-2">
            LawnHQ can make mistakes. Consider checking important info.
          </p>
        </div>
      </div>
    </div>
  );
}
