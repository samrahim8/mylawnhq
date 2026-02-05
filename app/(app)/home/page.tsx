"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CalendarActivity } from "@/types";
import { useProfile } from "@/hooks/useProfile";
import { useTodos } from "@/hooks/useTodos";
import { useCalendar } from "@/hooks/useCalendar";
import { useWeather } from "@/hooks/useWeather";
import { useSoilTemp } from "@/hooks/useSoilTemp";
import { usePhotos } from "@/hooks/usePhotos";
import { useProducts } from "@/hooks/useProducts";
import YardPhotoModal from "@/components/home/YardPhotoModal";
import RecentActivities from "@/components/home/RecentActivities";
import Calendar from "@/components/home/Calendar";
import TodoList from "@/components/home/TodoList";
import WeatherWidget from "@/components/home/WeatherWidget";
import SoilTemperature from "@/components/home/SoilTemperature";
import ActivityModal from "@/components/home/ActivityModal";
import TodoModal from "@/components/home/TodoModal";

type TabId = "activities" | "calendar" | "todos" | "weather" | "soil";

interface Tab {
  id: TabId;
  label: string;
  mobileLabel: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  {
    id: "activities",
    label: "The Log",
    mobileLabel: "The Log",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "calendar",
    label: "Calendar",
    mobileLabel: "Calendar",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "todos",
    label: "To Do",
    mobileLabel: "To Do",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "weather",
    label: "Weather",
    mobileLabel: "Weather",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
  {
    id: "soil",
    label: "Soil Temp",
    mobileLabel: "Soil Temp",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

function HomePageContent() {
  const { profile, isSetUp } = useProfile();
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const { activities, addActivity, deleteActivity, updateActivity } = useCalendar();
  const { weather, loading: weatherLoading } = useWeather(profile?.zipCode);
  const { soilTemp, loading: soilTempLoading } = useSoilTemp(profile?.zipCode);
  const { photos, addPhoto } = usePhotos();
  const { products, addProduct } = useProducts();

  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q");

  const [activeTab, setActiveTab] = useState<TabId>("activities");
  const [chatInput, setChatInput] = useState(initialQuery || "");
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<CalendarActivity | null>(null);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isChatFocused, setIsChatFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // If there's an initial query from the landing page, auto-redirect to chat
  useEffect(() => {
    if (initialQuery) {
      router.push(`/chat?q=${encodeURIComponent(initialQuery)}`);
    }
  }, [initialQuery, router]);

  // Check if user has yard photos (photos with area tag)
  const yardPhotos = photos.filter((p) =>
    p.area && ["front", "back", "left-side", "right-side"].includes(p.area)
  );
  const hasAllYardPhotos = yardPhotos.length >= 4;

  // Get first name for greeting
  const firstName = profile?.zipCode ? "there" : "there"; // Could be enhanced with actual user name


  const handleOpenActivityModal = useCallback(() => {
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  }, []);

  const handleEditActivity = useCallback((activity: CalendarActivity) => {
    setEditingActivity(activity);
    setIsActivityModalOpen(true);
  }, []);

  const handleCloseActivityModal = useCallback(() => {
    setIsActivityModalOpen(false);
    setEditingActivity(null);
  }, []);

  const handleUpdateActivity = useCallback(
    (activity: CalendarActivity) => {
      updateActivity(activity.id, activity);
    },
    [updateActivity]
  );

  const handlePhotoUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const url = event.target?.result as string;
        await addPhoto({
          url,
          date: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [addPhoto]
  );

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      window.location.href = `/chat?q=${encodeURIComponent(chatInput.trim())}`;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "activities":
        return (
          <RecentActivities
            activities={activities}
            onDeleteActivity={deleteActivity}
            onOpenActivityModal={handleOpenActivityModal}
            onEditActivity={handleEditActivity}
            compact
          />
        );
      case "calendar":
        return (
          <Calendar
            activities={activities}
            onOpenActivityModal={handleOpenActivityModal}
            compact
          />
        );
      case "todos":
        return (
          <TodoList
            todos={todos}
            onAdd={addTodo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onOpenModal={() => setIsTodoModalOpen(true)}
            compact
          />
        );
      case "weather":
        return <WeatherWidget weather={weather} loading={weatherLoading} compact />;
      case "soil":
        return (
          <SoilTemperature
            temperature={soilTemp?.current ?? null}
            trend={soilTemp?.trend ?? []}
            loading={soilTempLoading}
            compact
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-3 sm:p-4 lg:p-6">
      {/* Welcome Section */}
      <div className="flex-shrink-0 text-center mb-6 sm:mb-8 lg:mb-10 pt-4 sm:pt-8 lg:pt-12">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#7a8b6e] rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1a1a1a]">
          Let&apos;s make your neighbors jealous
        </h1>
      </div>

      {/* Chat Input Section */}
      <div className="flex-shrink-0 max-w-2xl mx-auto w-full mb-4 sm:mb-6">
        <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm overflow-hidden">
          {/* Burnt Orange Banner */}
          {!isSetUp ? (
            <Link
              href="/profile"
              className="w-full flex items-center justify-between px-4 py-2.5 bg-[#c17f59] hover:bg-[#b06f49] transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm text-white font-semibold">
                  Unlock the full toolkit — your grass will thank you.
                </span>
              </div>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          ) : (
            <div className="w-full h-2 bg-[#c17f59]" />
          )}

          {/* Chat Input */}
          <form onSubmit={handleChatSubmit} className="relative">
            {/* Custom placeholder with blinking cursor */}
            {!chatInput && !isChatFocused && (
              <div
                className="absolute left-4 top-4 text-base text-[#a3a3a3] pointer-events-none flex items-center"
                onClick={() => textareaRef.current?.focus()}
              >
                <span>Talk to me, grass whisperer.</span>
                <span className="ml-0.5 w-0.5 h-5 bg-[#7a8b6e] animate-pulse" />
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onFocus={() => setIsChatFocused(true)}
              onBlur={() => setIsChatFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleChatSubmit(e);
                }
              }}
              rows={3}
              className="w-full px-4 py-4 pr-14 text-base text-[#1a1a1a] focus:outline-none bg-transparent resize-none"
            />
            <button
              type="submit"
              className="absolute right-3 bottom-3 p-2.5 bg-[#7a8b6e] hover:bg-[#6a7b5e] text-white rounded-xl transition-colors"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex-shrink-0 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3 mb-6 sm:mb-8 max-w-md sm:max-w-2xl mx-auto px-4 sm:px-0">
        <button
          type="button"
          onClick={handleOpenActivityModal}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white hover:bg-[#f8f6f3] text-[#525252] hover:text-[#7a8b6e] rounded-lg text-xs sm:text-sm font-medium transition-colors border border-[#e5e5e5]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Log it
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white hover:bg-[#f8f6f3] text-[#525252] hover:text-[#7a8b6e] rounded-lg text-xs sm:text-sm font-medium transition-colors border border-[#e5e5e5]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Pic of Proof
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => setIsTodoModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white hover:bg-[#f8f6f3] text-[#525252] hover:text-[#7a8b6e] rounded-lg text-xs sm:text-sm font-medium transition-colors border border-[#e5e5e5]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Add Task
        </button>
        <Link
          href="/spreader"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white hover:bg-[#f8f6f3] text-[#525252] hover:text-[#7a8b6e] rounded-lg text-xs sm:text-sm font-medium transition-colors border border-[#e5e5e5]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Spreader Math
        </Link>
      </div>

      {/* Tab Section */}
      <div className="flex-shrink-0 max-w-4xl mx-auto w-full">
        {/* Tab Header */}
        <div className="bg-[#e8e5e0] rounded-t-2xl border border-[#e5e5e5] border-b-0 p-1.5">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-4 py-2.5 text-[10px] sm:text-sm font-medium whitespace-nowrap transition-colors rounded-xl ${
                  activeTab === tab.id
                    ? "text-[#7a8b6e] bg-white shadow-sm"
                    : "text-[#525252] hover:text-[#1a1a1a] hover:bg-[#f0ece5]"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.mobileLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-2xl border border-[#e5e5e5] border-t-0">
          <div className="p-3 sm:p-4 min-h-[350px]">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Activity Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={handleCloseActivityModal}
        onSave={addActivity}
        onUpdate={handleUpdateActivity}
        editingActivity={editingActivity}
        savedProducts={products}
        onAddProduct={addProduct}
      />

      {/* Todo Modal */}
      <TodoModal
        isOpen={isTodoModalOpen}
        onClose={() => setIsTodoModalOpen(false)}
        onAdd={addTodo}
      />

      {/* Yard Photo Modal */}
      <YardPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onAddPhoto={addPhoto}
        existingPhotos={photos}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="h-full flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#7a8b6e] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
