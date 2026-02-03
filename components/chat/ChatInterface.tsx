"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types";
import { useProfile } from "@/hooks/useProfile";
import { useCalendar } from "@/hooks/useCalendar";
import { useWeather } from "@/hooks/useWeather";

interface ChatInterfaceProps {
  initialMessage?: string;
}

export default function ChatInterface({ initialMessage }: ChatInterfaceProps) {
  const { profile } = useProfile();
  const { activities } = useCalendar();
  const { weather } = useWeather(profile?.zipCode);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialMessageProcessed = useRef(false);

  useEffect(() => {
    if (initialMessage && !initialMessageProcessed.current && messages.length === 0) {
      initialMessageProcessed.current = true;
      handleSend(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    // Check if this is the "What should I do today?" prompt
    const isTodayPrompt = text.toLowerCase().includes("what should i do today");

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build request body with optional weather and activities context
      const requestBody: {
        messages: { role: string; content: string }[];
        profile: typeof profile;
        weatherContext?: typeof weather;
        activitiesContext?: typeof activities;
      } = {
        messages: [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        })),
        profile: profile || null,
      };

      // Include weather and activities context for "What should I do today?" prompt
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

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
    // Simple markdown-like formatting
    return content
      .split("\n")
      .map((line, i) => {
        // Bold
        line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        // Headers
        if (line.startsWith("# ")) {
          return `<h3 class="text-lg font-bold text-neutral-900 mt-4 mb-2">${line.slice(2)}</h3>`;
        }
        if (line.startsWith("## ")) {
          return `<h4 class="text-base font-semibold text-neutral-900 mt-3 mb-1">${line.slice(3)}</h4>`;
        }
        // List items
        if (line.match(/^\d+\./)) {
          return `<p class="ml-4 text-neutral-600">${line}</p>`;
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return `<p class="ml-4 text-neutral-600">• ${line.slice(2)}</p>`;
        }
        // Regular paragraphs
        if (line.trim()) {
          return `<p class="text-neutral-600">${line}</p>`;
        }
        return "<br/>";
      })
      .join("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-4">🌿</div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Welcome to LawnHQ Chat
            </h2>
            <p className="text-neutral-600 max-w-md mb-8">
              Ask me anything about lawn care!
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-lg">
              {[
                "What should I do today?",
                "How often should I water my lawn?",
                "What's the best mowing height for my lawn?",
                "How do I fix bare spots?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="p-3 text-center text-sm bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-neutral-900 text-white rounded-br-md"
                      : "bg-neutral-50 text-neutral-900 rounded-bl-md"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div
                      className="space-y-1 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-50 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-neutral-200">
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-3">
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your lawn..."
              rows={1}
              className="flex-1 bg-transparent text-neutral-900 placeholder-neutral-400 outline-none resize-none max-h-32"
              style={{ minHeight: "24px" }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-lg transition-colors ${
                input.trim() && !isLoading
                  ? "bg-neutral-900 hover:bg-neutral-800 text-white"
                  : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
