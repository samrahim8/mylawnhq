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
import OnboardingModal from "@/components/home/OnboardingModal";
import { LawnPlan } from "@/components/home/LawnPlan";

type TabId = "log" | "calendar" | "todos" | "more";

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
  const showOnboarding = searchParams.get("onboarding") === "true";

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingData, setOnboardingData] = useState<{ zipCode?: string; grassType?: string } | null>(null);
  const [showSignupSheet, setShowSignupSheet] = useState(false);
  const [signupDismissed, setSignupDismissed] = useState(false);

  useEffect(() => {
    if (showOnboarding) {
      const stored = localStorage.getItem("lawnhq_onboarding");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          if (data.pending) {
            setOnboardingData(data);
            setIsOnboardingOpen(true);
          }
        } catch {
          // Ignore parse errors
        }
      }
      router.replace("/sandbox/home", { scroll: false });
    }
  }, [showOnboarding, router]);

  // Calculate counts
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const todayStr = now.toISOString().split("T")[0];
  const recentActivitiesCount = activities.filter((a) => {
    const actDate = new Date(a.date);
    return actDate >= sevenDaysAgo && actDate <= now;
  }).length;
  const futureEventsCount = activities.filter((a) => a.date > todayStr).length;
  const pendingTodosCount = todos.filter((t) => !t.completed).length;

  const [activeTab, setActiveTab] = useState<TabId>("log");
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

  useEffect(() => {
    if (initialQuery) {
      router.push(`/chat?q=${encodeURIComponent(initialQuery)}`);
    }
  }, [initialQuery, router]);

  // Show signup prompt after browsing
  useEffect(() => {
    const dismissed = localStorage.getItem("lawnhq_signup_dismissed");
    if (dismissed) {
      setSignupDismissed(true);
      return;
    }
    const timer = setTimeout(() => {
      setShowSignupSheet(true);
    }, 8000); // Show after 8 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleDismissSignup = (permanent: boolean) => {
    setShowSignupSheet(false);
    if (permanent) {
      localStorage.setItem("lawnhq_signup_dismissed", "true");
      setSignupDismissed(true);
    }
  };

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
        await addPhoto({ url, date: new Date().toISOString() });
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [addPhoto]
  );

  const processChatImage = (file: File): Promise<ChatImage> => {
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
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
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
      if (chatImages.length > 0) {
        sessionStorage.setItem("pendingChatImages", JSON.stringify(chatImages));
      }
      const query = chatInput.trim() || (chatImages.length > 0 ? "What can you tell me about this?" : "");
      window.location.href = `/chat?q=${encodeURIComponent(query)}${chatImages.length > 0 ? "&hasImages=true" : ""}`;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "log":
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
      case "more":
        return (
          <div className="space-y-4">
            <WeatherWidget weather={weather} loading={weatherLoading} compact />
            <SoilTemperature
              temperature={soilTemp?.current ?? null}
              trend={soilTemp?.trend ?? []}
              loading={soilTempLoading}
              compact
            />
            {/* Quick Links */}
            <div className="pt-2 space-y-2">
              <Link
                href="/profile"
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-deep-brown/10 active:scale-[0.98] transition-transform duration-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-medium text-deep-brown">My Profile</span>
                </div>
                <svg className="w-5 h-5 text-deep-brown/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/spreader"
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-deep-brown/10 active:scale-[0.98] transition-transform duration-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lawn/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium text-deep-brown">Spreader Calculator</span>
                </div>
                <svg className="w-5 h-5 text-deep-brown/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/gear"
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-deep-brown/10 active:scale-[0.98] transition-transform duration-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-deep-brown/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-deep-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-deep-brown">My Gear</span>
                </div>
                <svg className="w-5 h-5 text-deep-brown/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="fixed inset-0 bg-cream flex flex-col lg:hidden">
        {/* Safe area top */}
        <div className="bg-cream pt-[env(safe-area-inset-top)]" />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4 space-y-4">
            {/* Setup prompt banner */}
            {!isSetUp && (
              <Link
                href="/profile"
                className="flex items-center justify-between p-4 bg-terracotta rounded-2xl active:scale-[0.98] transition-transform duration-100"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-white font-semibold">Complete your profile</span>
                </div>
                <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}

            {/* 90-Day Plan */}
            <LawnPlan />

            {/* Chat Input Card */}
            <div className="bg-white rounded-2xl border border-deep-brown/10 overflow-hidden">
              <form onSubmit={handleChatSubmit}>
                {/* Image previews */}
                {chatImages.length > 0 && (
                  <div className="flex gap-2 px-4 pt-3 flex-wrap">
                    {chatImages.map((img) => (
                      <div key={img.id} className="relative">
                        <img
                          src={img.preview}
                          alt="Upload preview"
                          className="w-16 h-16 object-cover rounded-xl border border-deep-brown/10"
                        />
                        <button
                          type="button"
                          onClick={() => removeChatImage(img.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm active:scale-95"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hidden inputs */}
                <input ref={chatFileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple onChange={handleChatImageUpload} className="hidden" />
                <input ref={chatCameraInputRef} type="file" accept="image/jpeg,image/png" capture="environment" onChange={handleChatImageUpload} className="hidden" />

                {/* Textarea */}
                <div className="relative">
                  {!chatInput && !isChatFocused && chatImages.length === 0 && (
                    <div className="absolute left-4 top-4 text-base text-deep-brown/40 pointer-events-none flex items-center">
                      <span>Ask me anything about your lawn...</span>
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
                    rows={2}
                    className="w-full px-4 py-4 text-base text-deep-brown focus:outline-none bg-transparent resize-none"
                  />
                </div>

                {/* Bottom action row */}
                <div className="flex items-center justify-between px-3 pb-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => chatFileInputRef.current?.click()}
                      disabled={chatImages.length >= 4}
                      className="p-3 rounded-xl text-lawn active:bg-lawn/10 transition-colors disabled:text-deep-brown/20"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => chatCameraInputRef.current?.click()}
                      disabled={chatImages.length >= 4}
                      className="p-3 rounded-xl text-lawn active:bg-lawn/10 transition-colors disabled:text-deep-brown/20"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!chatInput.trim() && chatImages.length === 0}
                    className={`p-3 rounded-xl transition-all active:scale-95 ${
                      chatInput.trim() || chatImages.length > 0
                        ? "bg-lawn text-white"
                        : "bg-deep-brown/10 text-deep-brown/30"
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Actions - 2x2 grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleOpenActivityModal}
                className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-deep-brown/10 active:scale-[0.97] transition-transform duration-100"
              >
                <div className="w-10 h-10 bg-lawn/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-lawn" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-medium text-deep-brown text-sm">Log Activity</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-deep-brown/10 active:scale-[0.97] transition-transform duration-100"
              >
                <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium text-deep-brown text-sm">Add Photo</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              <button
                type="button"
                onClick={() => setIsTodoModalOpen(true)}
                className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-deep-brown/10 active:scale-[0.97] transition-transform duration-100"
              >
                <div className="w-10 h-10 bg-ochre/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <span className="font-medium text-deep-brown text-sm">Add Task</span>
              </button>
              <Link
                href="/spreader"
                className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-deep-brown/10 active:scale-[0.97] transition-transform duration-100"
              >
                <div className="w-10 h-10 bg-deep-brown/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-deep-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium text-deep-brown text-sm">Spreader</span>
              </Link>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl border border-deep-brown/10 p-4 min-h-[300px]">
              {renderTabContent()}
            </div>

            {/* Bottom padding for tab bar */}
            <div className="h-20" />
          </div>
        </div>

        {/* Bottom Tab Bar - Fixed */}
        <div className="bg-white border-t border-deep-brown/10 pb-[env(safe-area-inset-bottom)]">
          <div className="flex">
            {[
              { id: "log" as TabId, label: "Log", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", count: recentActivitiesCount },
              { id: "calendar" as TabId, label: "Calendar", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", count: futureEventsCount },
              { id: "todos" as TabId, label: "Tasks", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", count: pendingTodosCount },
              { id: "more" as TabId, label: "More", icon: "M4 6h16M4 12h16M4 18h16", count: null },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center justify-center py-3 min-h-[56px] active:bg-deep-brown/5 transition-colors ${
                    isActive ? "text-lawn" : "text-deep-brown/50"
                  }`}
                >
                  <div className="relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                    </svg>
                    {tab.count !== null && tab.count > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {tab.count > 9 ? "9+" : tab.count}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium mt-1">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Keep original structure */}
      <div className="hidden lg:block h-full overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <LawnPlan />

          {/* Chat and actions for desktop */}
          <div className="bg-white rounded-2xl border border-deep-brown/10 p-6">
            <form onSubmit={handleChatSubmit} className="flex gap-4">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything about your lawn..."
                rows={2}
                className="flex-1 px-4 py-3 text-base border border-deep-brown/10 rounded-xl focus:outline-none focus:border-lawn resize-none"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="px-6 py-3 bg-lawn text-white font-medium rounded-xl hover:bg-lawn/90 disabled:bg-deep-brown/10 disabled:text-deep-brown/30 transition-colors"
              >
                Ask
              </button>
            </form>
          </div>

          {/* Desktop tab section */}
          <div className="bg-white rounded-2xl border border-deep-brown/10 overflow-hidden">
            <div className="flex border-b border-deep-brown/10">
              {[
                { id: "log" as TabId, label: "Activity Log", count: recentActivitiesCount },
                { id: "calendar" as TabId, label: "Calendar", count: futureEventsCount },
                { id: "todos" as TabId, label: "Tasks", count: pendingTodosCount },
                { id: "more" as TabId, label: "More", count: null },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-lawn border-b-2 border-lawn bg-lawn/5"
                        : "text-deep-brown/60 hover:text-deep-brown hover:bg-deep-brown/5"
                    }`}
                  >
                    {tab.label}
                    {tab.count !== null && tab.count > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-terracotta text-white text-xs rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="p-6 min-h-[400px]">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Signup Bottom Sheet */}
      {showSignupSheet && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => handleDismissSignup(false)}
          />

          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl animate-slide-up pb-[env(safe-area-inset-bottom)]">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-deep-brown/20 rounded-full" />
            </div>

            <div className="px-6 pb-6">
              {/* Icon */}
              <div className="w-16 h-16 bg-lawn/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>

              {/* Content */}
              <h2 className="font-display text-2xl font-bold text-deep-brown text-center mb-2">
                Love your plan?
              </h2>
              <p className="text-deep-brown/70 text-center mb-6">
                Create a free account to save it, get reminders, and sync across all your devices.
              </p>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                {[
                  { icon: "M5 13l4 4L19 7", text: "Save your 90-day plan forever" },
                  { icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", text: "Weekly care reminders" },
                  { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", text: "Unlimited AI lawn advice" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-lawn/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                    </div>
                    <span className="text-deep-brown">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <Link
                href="/signup"
                className="block w-full py-4 bg-lawn text-white font-bold text-center rounded-2xl active:scale-[0.98] transition-transform duration-100 mb-3"
              >
                Sign Up Free
              </Link>
              <button
                type="button"
                onClick={() => handleDismissSignup(false)}
                className="block w-full py-3 text-deep-brown/60 font-medium text-center active:text-deep-brown transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={handleCloseActivityModal}
        onSave={addActivity}
        onUpdate={handleUpdateActivity}
        editingActivity={editingActivity}
        savedProducts={products}
        onAddProduct={addProduct}
      />
      <TodoModal
        isOpen={isTodoModalOpen}
        onClose={() => setIsTodoModalOpen(false)}
        onAdd={addTodo}
      />
      <YardPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onAddPhoto={addPhoto}
        existingPhotos={photos}
      />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialData={onboardingData || undefined}
      />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-cream flex flex-col pt-[env(safe-area-inset-top)]">
          <div className="flex-1 px-4 py-4 space-y-4 animate-pulse">
            <div className="h-48 bg-deep-brown/10 rounded-2xl" />
            <div className="h-32 bg-deep-brown/10 rounded-2xl" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-20 bg-deep-brown/10 rounded-2xl" />
              <div className="h-20 bg-deep-brown/10 rounded-2xl" />
              <div className="h-20 bg-deep-brown/10 rounded-2xl" />
              <div className="h-20 bg-deep-brown/10 rounded-2xl" />
            </div>
          </div>
          <div className="h-20 bg-white border-t border-deep-brown/10" />
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
