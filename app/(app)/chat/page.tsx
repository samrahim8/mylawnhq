"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatInterface from "@/components/chat/ChatInterface";

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQuestion = searchParams.get("q") || undefined;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ChatInterface initialMessage={initialQuestion} />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <div className="text-earth-400">Loading chat...</div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
