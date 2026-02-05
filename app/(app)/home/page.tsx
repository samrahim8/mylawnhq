"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CalendarActivity, ChatImage } from "@/types";
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
import { Clock, Calendar as CalendarIcon, CheckSquare, Cloud, Thermometer, LucideIcon } from "lucide-react";

type TabId = "activities" | "calendar" | "todos" | "weather" | "soil";

interface Tab {
  id: TabId;
  label: string;
  mobileLabel: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  {
    id: "activities",
    label: "The Log",
    mobileLabel: "The Log",
    icon: Clock,
  },
  {
    id: "calendar",
    label: "Calendar",
    mobileLabel: "Calendar",
    icon: CalendarIcon,
  },
  {
    id: "todos",
    label: "To Do",
    mobileLabel: "To Do",
    icon: CheckSquare,
  },
  {
    id: "weather",
    label: "Weather",
    mobileLabel: "Weather",
    icon: Cloud,
  },
  {
    id: "soil",
    label: "Soil Temp",
    mobileLabel: "Soil Temp",
    icon: Thermometer,
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

  // Calculate tab counts
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const todayStr = now.toISOString().split("T")[0];

  // The Log: activities in the past 7 days
  const recentActivitiesCount = activities.filter((a) => {
    const actDate = new Date(a.date);
    return actDate >= sevenDaysAgo && actDate <= now;
  }).length;

  // Calendar: future events (date > today)
  const futureEventsCount = activities.filter((a) => a.date > todayStr).length;

  // To Do: incomplete todos
  const pendingTodosCount = todos.filter((t) => !t.completed).length;

  const [activeTab, setActiveTab] = useState<TabId>("activities");
  const [chatInput, setChatInput] = useState(initialQuery || "");
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<CalendarActivity | null>(null);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isChatFocused, setIsChatFocused] = useState(false);
  const [chatImages, setChatImages] = useState<ChatImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const chatCameraInputRef = useRef<HTMLInputElement>(null);
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

  const processChatImage = (file: File): Promise<ChatImage> => {
    return new Promise((resolve, reject) => {
      if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
        reject(new Error("Please upload a JPEG, PNG, GIF, or WebP image"));
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        reject(new Error("Image must be smaller than 5MB"));
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const base64 = dataUrl.split(",")[1];
        resolve({
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          data: base64,
          mimeType: file.type as ChatImage["mimeType"],
          preview: dataUrl,
        });
      };
      reader.onerror = () => reject(new Error("Failed to read image"));
      reader.readAsDataURL(file);
    });
  };

  const handleChatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const newImages = await Promise.all(Array.from(files).map(processChatImage));
      setChatImages((prev) => [...prev, ...newImages].slice(0, 4));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to upload image");
    }
    e.target.value = "";
  };

  const removeChatImage = (imageId: string) => {
    setChatImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() || chatImages.length > 0) {
      // Store images in sessionStorage to pass to chat page
      if (chatImages.length > 0) {
        sessionStorage.setItem("pendingChatImages", JSON.stringify(chatImages));
      }
      const query = chatInput.trim() || (chatImages.length > 0 ? "What can you tell me about this?" : "");
      window.location.href = `/chat?q=${encodeURIComponent(query)}${chatImages.length > 0 ? "&hasImages=true" : ""}`;
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
            {/* Image preview */}
            {chatImages.length > 0 && (
              <div className="flex gap-2 px-4 pt-3 flex-wrap">
                {chatImages.map((img) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.preview}
                      alt="Upload preview"
                      className="w-16 h-16 object-cover rounded-lg border border-[#e5e5e5]"
                    />
                    <button
                      type="button"
                      onClick={() => removeChatImage(img.id)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Hidden file inputs for chat */}
            <input
              ref={chatFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              onChange={handleChatImageUpload}
              className="hidden"
            />
            <input
              ref={chatCameraInputRef}
              type="file"
              accept="image/jpeg,image/png"
              capture="environment"
              onChange={handleChatImageUpload}
              className="hidden"
            />

            {/* Custom placeholder with blinking cursor */}
            {!chatInput && !isChatFocused && chatImages.length === 0 && (
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
              placeholder={chatImages.length > 0 ? "Add a question about your photo..." : ""}
              rows={3}
              className="w-full px-4 py-4 pr-14 text-base text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none bg-transparent resize-none"
            />

            {/* Bottom buttons row */}
            <div className="absolute left-3 bottom-3 flex items-center gap-1">
              {/* Photo upload button */}
              <button
                type="button"
                onClick={() => chatFileInputRef.current?.click()}
                disabled={chatImages.length >= 4}
                className={`p-2 rounded-lg transition-colors ${
                  chatImages.length >= 4
                    ? "text-[#d4d4d4] cursor-not-allowed"
                    : "text-[#7a8b6e] hover:bg-[#7a8b6e]/10"
                }`}
                title="Upload photo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              {/* Camera button */}
              <button
                type="button"
                onClick={() => chatCameraInputRef.current?.click()}
                disabled={chatImages.length >= 4}
                className={`p-2 rounded-lg transition-colors ${
                  chatImages.length >= 4
                    ? "text-[#d4d4d4] cursor-not-allowed"
                    : "text-[#7a8b6e] hover:bg-[#7a8b6e]/10"
                }`}
                title="Take photo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            <button
              type="submit"
              disabled={!chatInput.trim() && chatImages.length === 0}
              className={`absolute right-3 bottom-3 p-2 rounded-lg transition-colors ${
                chatInput.trim() || chatImages.length > 0
                  ? "bg-[#7a8b6e] hover:bg-[#6a7b5e] text-white"
                  : "bg-[#e5e5e5] text-[#a3a3a3] cursor-not-allowed"
              }`}
              aria-label="Send message"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        {/* Tab Header - Pill Style */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            // Get count for tabs that have them
            let count: number | null = null;
            if (tab.id === "activities") count = recentActivitiesCount;
            if (tab.id === "calendar") count = futureEventsCount;
            if (tab.id === "todos") count = pendingTodosCount;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border-2 ${
                  isActive
                    ? "bg-[#8B9D82] text-white border-[#8B9D82] shadow-md"
                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                <Icon
                  size={16}
                  strokeWidth={2}
                  className={isActive ? "text-white" : "text-stone-500"}
                />
                <span>{tab.label}</span>
                {count !== null && count > 0 && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] sm:text-xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#C17F59] text-white"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl border-2 border-stone-200 shadow-sm">
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
