"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChatMessage, ChatImage } from "@/types";
import { useProfile } from "@/hooks/useProfile";

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuestion = searchParams.get("q") || "";
  const hasImages = searchParams.get("hasImages") === "true";

  const { profile } = useProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingImages, setPendingImages] = useState<ChatImage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const initialMessageProcessed = useRef(false);

  // Load pending images from session storage
  useEffect(() => {
    if (hasImages) {
      const stored = sessionStorage.getItem("pendingChatImages");
      if (stored) {
        try {
          setPendingImages(JSON.parse(stored));
          sessionStorage.removeItem("pendingChatImages");
        } catch {
          // Ignore
        }
      }
    }
  }, [hasImages]);

  // Handle initial message
  useEffect(() => {
    if (initialQuestion && !initialMessageProcessed.current) {
      initialMessageProcessed.current = true;
      // Small delay to allow images to load
      setTimeout(() => {
        if (initialQuestion.trim()) {
          handleSend(initialQuestion);
        }
      }, 100);
    }
  }, [initialQuestion]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const processImage = (file: File): Promise<ChatImage> => {
    return new Promise((resolve, reject) => {
      if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
        reject(new Error("Please upload a JPEG, PNG, GIF, or WebP image"));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error("Image must be smaller than 5MB"));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        resolve({
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          data: dataUrl.split(",")[1],
          mimeType: file.type as ChatImage["mimeType"],
          preview: dataUrl,
        });
      };
      reader.onerror = () => reject(new Error("Failed to read image"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const newImages = await Promise.all(Array.from(files).map(processImage));
      setPendingImages((prev) => [...prev, ...newImages].slice(0, 4));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to upload image");
    }
    e.target.value = "";
  };

  const removeImage = (imageId: string) => {
    setPendingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if ((!text && pendingImages.length === 0) || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text || "What can you tell me about this?",
      timestamp: new Date().toISOString(),
      images: pendingImages.length > 0 ? [...pendingImages] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    const imagesToSend = [...pendingImages];
    setPendingImages([]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
            images: m.images?.map((img) => ({
              data: img.data,
              mimeType: img.mimeType,
            })),
          })),
          profile: {
            zipCode: profile?.zipCode,
            grassType: profile?.grassType,
            lawnSize: profile?.lawnSize,
            sunExposure: profile?.sunExposure,
          },
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I had trouble processing that. Please try again.",
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

  return (
    <div className="fixed inset-0 bg-cream flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-deep-brown/10 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-xl active:bg-deep-brown/5 lg:hover:bg-deep-brown/5 transition-colors"
          >
            <svg className="w-5 h-5 text-deep-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-9 h-9 bg-lawn/10 rounded-xl flex items-center justify-center text-lg">
            🧑‍🌾
          </div>
          <div className="flex-1">
            <h1 className="font-semibold text-deep-brown">Larry</h1>
            <p className="text-xs text-deep-brown/50">Your lawn expert</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-lawn/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl">
                🧑‍🌾
              </div>
              <h2 className="font-display text-xl font-bold text-deep-brown mb-2">
                Hey, I&apos;m Larry!
              </h2>
              <p className="text-deep-brown/60 max-w-xs mx-auto">
                Your personal lawn expert. Ask me anything or snap a photo of your lawn for diagnosis.
              </p>

              {/* Suggestion chips */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {[
                  "Why is my grass turning brown?",
                  "When should I fertilize?",
                  "How often should I water?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSend(suggestion)}
                    className="px-4 py-2 bg-white border border-deep-brown/10 rounded-full text-sm text-deep-brown/70 hover:border-lawn/30 hover:text-lawn active:scale-95 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              {message.role === "assistant" && (
                <div className="w-8 h-8 bg-lawn/10 rounded-xl flex items-center justify-center text-sm flex-shrink-0">
                  🧑‍🌾
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-lawn text-white rounded-br-md"
                    : "bg-white border border-deep-brown/10 text-deep-brown rounded-bl-md"
                }`}
              >
                {/* Images */}
                {message.images && message.images.length > 0 && (
                  <div className="flex gap-2 mb-2">
                    {message.images.map((img) => (
                      <img
                        key={img.id}
                        src={img.preview}
                        alt="Uploaded"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-lawn/10 rounded-xl flex items-center justify-center text-sm flex-shrink-0">
                🧑‍🌾
              </div>
              <div className="bg-white border border-deep-brown/10 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-deep-brown/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-deep-brown/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-deep-brown/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-deep-brown/10 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* Pending images preview */}
          {pendingImages.length > 0 && (
            <div className="flex gap-2 mb-3 pb-3 border-b border-deep-brown/10">
              {pendingImages.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.preview}
                    alt="To upload"
                    className="w-16 h-16 object-cover rounded-lg border border-deep-brown/10"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-deep-brown text-white rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input row */}
          <div className="flex gap-2 items-end">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/jpeg,image/png"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="flex-1 flex items-end gap-2 px-3 py-2 bg-cream/50 border border-deep-brown/10 rounded-2xl focus-within:border-lawn">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="p-1.5 text-deep-brown/40 hover:text-lawn active:scale-95 transition-all rounded-lg hover:bg-lawn/10 flex-shrink-0 lg:hidden"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-deep-brown/40 hover:text-lawn active:scale-95 transition-all rounded-lg hover:bg-lawn/10 flex-shrink-0 hidden lg:block"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Larry anything..."
                rows={1}
                className="flex-1 bg-transparent text-base resize-none focus:outline-none min-h-[24px] max-h-[120px]"
              />
            </div>

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={(!input.trim() && pendingImages.length === 0) || isLoading}
              className="p-3 bg-lawn text-white rounded-xl disabled:bg-deep-brown/10 disabled:text-deep-brown/30 active:scale-95 transition-all flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SandboxChatPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-cream flex items-center justify-center">
          <div className="text-deep-brown/40">Loading...</div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
