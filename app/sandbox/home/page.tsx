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
import TodoList from "@/components/home/TodoList";
import ActivityModal from "@/components/home/ActivityModal";
import TodoModal from "@/components/home/TodoModal";
import OnboardingModal from "@/components/home/OnboardingModal";
import { LawnPlan } from "@/components/home/LawnPlan";
import { getSamplePlan, type PlanMonth } from "@/app/sandbox/plan/samplePlan";

type MobileView = "home" | "plan" | "activity";

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
  const recentActivitiesFiltered = activities.filter((a) => {
    const actDate = new Date(a.date);
    return actDate >= sevenDaysAgo && actDate <= now;
  });
  const recentActivities = recentActivitiesFiltered.slice(0, 3); // Only show 3 for preview
  const recentActivitiesCount = recentActivitiesFiltered.length;
  const upcomingActivities = activities.filter((a) => a.date > todayStr).slice(0, 3);
  const futureEventsCount = activities.filter((a) => a.date > todayStr).length;
  const pendingTodos = todos.filter((t) => !t.completed).slice(0, 3);
  const pendingTodosCount = todos.filter((t) => !t.completed).length;

  // Mobile view state
  const [mobileView, setMobileView] = useState<MobileView>("home");
  const [fabOpen, setFabOpen] = useState(false);

  const [chatInput, setChatInput] = useState(initialQuery || "");
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<CalendarActivity | null>(null);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isChatFocused, setIsChatFocused] = useState(false);
  const [showLarryInfo, setShowLarryInfo] = useState(false);
  const [chatImages, setChatImages] = useState<ChatImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const chatCameraInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Next task from 90-day plan
  const [nextTask, setNextTask] = useState<{ task: string; week: string; month: string; key: string; totalTasks: number; completedCount: number } | null>(null);

  const findNextTask = useCallback(() => {
    const stored = localStorage.getItem("lawnhq_plan_params");
    const savedTasks = localStorage.getItem("lawnhq_completed_tasks");

    if (stored) {
      try {
        const params = JSON.parse(stored);
        const plan = getSamplePlan(params.grassType, params.lawnSize, params.lawnGoal, params.path);
        const completed: Record<string, boolean> = savedTasks ? JSON.parse(savedTasks) : {};

        // Count total and completed
        let totalTasks = 0;
        let completedCount = 0;
        for (const month of plan) {
          for (const week of month.weeks) {
            totalTasks += week.tasks.length;
          }
        }
        completedCount = Object.values(completed).filter(Boolean).length;

        // Find first incomplete task
        for (let mIdx = 0; mIdx < plan.length; mIdx++) {
          const month = plan[mIdx];
          for (let wIdx = 0; wIdx < month.weeks.length; wIdx++) {
            const week = month.weeks[wIdx];
            for (let tIdx = 0; tIdx < week.tasks.length; tIdx++) {
              const key = `${mIdx}-${wIdx}-${tIdx}`;
              if (!completed[key]) {
                setNextTask({
                  task: week.tasks[tIdx],
                  week: week.label,
                  month: month.name,
                  key,
                  totalTasks,
                  completedCount,
                });
                return;
              }
            }
          }
        }
        // All tasks complete
        setNextTask({ task: "", week: "", month: "", key: "", totalTasks, completedCount });
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    findNextTask();
  }, [findNextTask]);

  const markTaskDone = () => {
    if (!nextTask || !nextTask.key) return;

    // Update completed tasks in localStorage
    const savedTasks = localStorage.getItem("lawnhq_completed_tasks");
    const completed: Record<string, boolean> = savedTasks ? JSON.parse(savedTasks) : {};
    completed[nextTask.key] = true;
    localStorage.setItem("lawnhq_completed_tasks", JSON.stringify(completed));

    // Find the next task
    findNextTask();
  };

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
    setFabOpen(false);
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
      setFabOpen(false);
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

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Get weather icon
  const getWeatherIcon = (condition?: string) => {
    if (!condition) return "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z";
    const c = condition.toLowerCase();
    if (c.includes("rain") || c.includes("drizzle")) return "M19.5 10a4.5 4.5 0 10-7.34-5.2A5.5 5.5 0 004 10.5 4 4 0 005 18h13a3 3 0 001.5-5.6zM8 15v2m4-2v4m4-4v2";
    if (c.includes("cloud")) return "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z";
    if (c.includes("snow")) return "M12 3v18m0-18l-3 3m3-3l3 3m-6 12l3-3m3 3l-3-3m-6-9h18M3 12l3-3m-3 3l3 3m12-6l3 3m-3-3l3-3";
    return "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z";
  };

  // Get human-readable activity name
  const getActivityName = (type: CalendarActivity["type"]) => {
    const names: Record<CalendarActivity["type"], string> = {
      mow: "Mowed lawn",
      water: "Watered",
      fertilize: "Fertilized",
      aerate: "Aerated",
      pest: "Pest control",
      weedControl: "Weed control",
      seed: "Seeded",
      other: "Other activity",
    };
    return names[type] || type;
  };

  // Format grass type for display
  const formatGrassType = (type?: string) => {
    if (!type) return null;
    const names: Record<string, string> = {
      "bermuda": "Bermuda",
      "zoysia": "Zoysia",
      "st-augustine": "St. Augustine",
      "fescue-kbg": "Fescue/KBG",
    };
    return names[type] || type.charAt(0).toUpperCase() + type.slice(1).replace(/[-_]/g, " ");
  };

  return (
    <>
      {/* Mobile Layout - Lawn Status Dashboard */}
      <div className="fixed inset-0 bg-cream flex flex-col lg:hidden">
        {/* Safe area top */}
        <div className="bg-cream pt-[env(safe-area-inset-top)]" />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4 space-y-4">
            {/* === LEVEL 1: Hero Status Card === */}
            <div className="bg-white rounded-2xl border border-deep-brown/10 p-4">
              <div className="flex items-center justify-between">
                {/* Greeting + Lawn status */}
                <div>
                  <p className="text-deep-brown/60 text-sm">{getGreeting()}</p>
                  <h1 className="font-display text-xl font-bold text-deep-brown">
                    {profile?.grassType ? `Your ${formatGrassType(profile.grassType)}` : "Your Lawn"}
                  </h1>
                </div>
                {/* Weather badge */}
                {weather && !weatherLoading ? (
                  <div className="flex items-center gap-2 bg-cream rounded-xl px-3 py-2">
                    <svg className="w-5 h-5 text-ochre" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={getWeatherIcon(weather.current?.condition)} />
                    </svg>
                    <span className="font-semibold text-deep-brown">{weather.current?.temp}°</span>
                  </div>
                ) : weatherLoading ? (
                  <div className="w-16 h-10 bg-deep-brown/10 rounded-xl animate-pulse" />
                ) : null}
              </div>

              {/* Soil temp inline if available */}
              {soilTemp && !soilTempLoading && (
                <div className="mt-3 flex items-center gap-2 text-sm text-deep-brown/70">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                  </svg>
                  <span>Soil: {soilTemp.current}°F</span>
                  {soilTemp.current >= 55 && <span className="text-lawn font-medium">· Good for seeding</span>}
                </div>
              )}
            </div>

            {/* === Progress Overview Card === */}
            {nextTask && nextTask.totalTasks > 0 && (
              <div className="bg-white rounded-2xl border border-deep-brown/10 p-4">
                <div className="flex items-center gap-4">
                  {/* Progress Ring */}
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#E8E4DC" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15" fill="none" stroke="#4A6741" strokeWidth="3"
                        strokeDasharray={`${(nextTask.completedCount / nextTask.totalTasks) * 94.2} 94.2`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-deep-brown">
                        {Math.round((nextTask.completedCount / nextTask.totalTasks) * 100)}%
                      </span>
                    </div>
                  </div>
                  {/* Plan Info */}
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-deep-brown">Your 90-Day Plan</h3>
                    <p className="text-sm text-deep-brown/60 mt-0.5">
                      {nextTask.completedCount} of {nextTask.totalTasks} tasks done
                    </p>
                    <button
                      type="button"
                      onClick={() => setMobileView("plan")}
                      className="text-sm text-lawn font-medium mt-1 active:text-lawn/70"
                    >
                      View full plan →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* === Hero Task Card === */}
            {nextTask && nextTask.task ? (
              <div className="bg-lawn rounded-2xl p-5 shadow-lg shadow-lawn/20">
                {/* Task Type Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-white/70 bg-white/15 px-2.5 py-1 rounded-full">
                    {nextTask.month} · {nextTask.week}
                  </span>
                </div>
                {/* Task Content */}
                <p className="text-white font-semibold text-lg leading-snug">
                  {nextTask.task}
                </p>
                {/* Mark Complete Button */}
                <button
                  type="button"
                  onClick={markTaskDone}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-white text-lawn font-semibold py-3 rounded-xl active:scale-[0.98] transition-transform"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Mark Complete
                </button>
              </div>
            ) : nextTask ? (
              <div className="bg-lawn/10 rounded-2xl p-5 text-center">
                <div className="w-14 h-14 bg-lawn/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-display font-bold text-deep-brown text-lg">All tasks complete!</p>
                <p className="text-deep-brown/60 mt-1">{nextTask.completedCount} tasks done this season</p>
              </div>
            ) : (
              <Link
                href="/sandbox"
                className="block bg-lawn rounded-2xl p-5 shadow-lg shadow-lawn/20 active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">Get Started</p>
                    <p className="text-white font-bold text-lg">Create Your 90-Day Plan</p>
                  </div>
                </div>
              </Link>
            )}

            {/* === Ask Larry Chat Card === */}
            <div className="bg-white rounded-2xl border border-deep-brown/10 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-lawn/10 rounded-xl flex items-center justify-center text-lg">
                  🧑‍🌾
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-deep-brown">Ask Larry</h3>
                    <button
                      type="button"
                      onClick={() => setShowLarryInfo(true)}
                      className="w-4 h-4 bg-deep-brown/10 rounded-full flex items-center justify-center text-[10px] font-bold text-deep-brown/50 hover:bg-deep-brown/20 hover:text-deep-brown/70 transition-colors"
                    >
                      ?
                    </button>
                  </div>
                  <p className="text-xs text-deep-brown/60">Your personal lawn expert</p>
                </div>
              </div>
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input ref={chatFileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple onChange={handleChatImageUpload} className="hidden" />
                <input ref={chatCameraInputRef} type="file" accept="image/jpeg,image/png" capture="environment" onChange={handleChatImageUpload} className="hidden" />
                <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-deep-brown/10 rounded-xl focus-within:border-lawn bg-cream/50">
                  <button
                    type="button"
                    onClick={() => chatCameraInputRef.current?.click()}
                    className="p-1.5 text-deep-brown/40 hover:text-lawn active:scale-95 transition-all rounded-lg hover:bg-lawn/10"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Why are there brown patches?"
                    className="flex-1 text-base bg-transparent focus:outline-none min-w-0"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!chatInput.trim() && chatImages.length === 0}
                  className="px-4 py-3 bg-lawn text-white font-medium rounded-xl disabled:bg-deep-brown/10 disabled:text-deep-brown/30 active:scale-95 transition-all"
                >
                  Ask
                </button>
              </form>
            </div>

            {/* === Log Activity Button === */}
            <button
              type="button"
              onClick={handleOpenActivityModal}
              className="w-full bg-white rounded-2xl border border-deep-brown/10 p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 bg-lawn rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-left flex-1">
                <span className="text-sm font-semibold text-deep-brown">Log Activity</span>
                <p className="text-xs text-deep-brown/50">Did you mow, water, or fertilize?</p>
              </div>
              <svg className="w-5 h-5 text-deep-brown/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Bottom padding for nav */}
            <div className="h-20" />
          </div>
        </div>

        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />

        {/* Bottom Nav Bar */}
        <div className="bg-white border-t border-deep-brown/10 pb-[env(safe-area-inset-bottom)]">
          <div className="flex">
            {[
              { id: "home" as MobileView, label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { id: "plan" as MobileView, label: "Plan", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
              { id: "activity" as MobileView, label: "Activity", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map((nav) => {
              const isActive = mobileView === nav.id;
              return (
                <button
                  key={nav.id}
                  type="button"
                  onClick={() => setMobileView(nav.id)}
                  className={`flex-1 flex flex-col items-center justify-center py-3 min-h-[56px] active:bg-deep-brown/5 transition-colors ${
                    isActive ? "text-lawn" : "text-deep-brown/50"
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={nav.icon} />
                  </svg>
                  <span className="text-xs font-medium mt-1">{nav.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Full-Screen Views (Plan, Activity, Tasks) */}
      {mobileView !== "home" && (
        <div className="fixed inset-0 bg-cream z-50 flex flex-col lg:hidden">
          {/* Safe area + header */}
          <div className="bg-white border-b border-deep-brown/10 pt-[env(safe-area-inset-top)]">
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                type="button"
                onClick={() => setMobileView("home")}
                className="p-2 -ml-2 rounded-xl active:bg-deep-brown/5"
              >
                <svg className="w-5 h-5 text-deep-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="font-display text-lg font-bold text-deep-brown">
                {mobileView === "plan" && "Your 90-Day Plan"}
                {mobileView === "activity" && "Activity Log"}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {mobileView === "plan" && <LawnPlan />}
            {mobileView === "activity" && (
              <RecentActivities
                activities={activities}
                onDeleteActivity={deleteActivity}
                onOpenActivityModal={handleOpenActivityModal}
                onEditActivity={handleEditActivity}
                compact
              />
            )}
          </div>

          {/* Bottom safe area */}
          <div className="pb-[env(safe-area-inset-bottom)]" />
        </div>
      )}

      {/* Desktop Layout - Dashboard with 2-column grid */}
      <div className="hidden lg:block h-full overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* === Hero Header Row === */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-deep-brown/60">{getGreeting()}</p>
              <h1 className="font-display text-2xl font-bold text-deep-brown">
                {profile?.grassType ? `Your ${formatGrassType(profile.grassType)} Lawn` : "Your Lawn Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* View Plan button */}
              {nextTask && nextTask.totalTasks > 0 && (
                <button
                  type="button"
                  onClick={() => document.getElementById('desktop-full-plan')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 bg-white text-deep-brown/70 rounded-xl px-4 py-2.5 font-medium border border-deep-brown/10 hover:border-lawn/30 hover:text-lawn transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View Plan
                </button>
              )}
              {/* Soil temp badge */}
              {soilTemp && !soilTempLoading && (
                <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-deep-brown/10">
                  <svg className="w-5 h-5 text-deep-brown/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                  </svg>
                  <span className="text-deep-brown font-medium">Soil: {soilTemp.current}°F</span>
                  {soilTemp.current >= 55 && <span className="text-xs text-lawn font-medium bg-lawn/10 px-2 py-0.5 rounded-full">Good for seeding</span>}
                </div>
              )}
              {/* Weather badge */}
              {weather && !weatherLoading && (
                <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-deep-brown/10">
                  <svg className="w-5 h-5 text-ochre" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={getWeatherIcon(weather.current?.condition)} />
                  </svg>
                  <span className="text-deep-brown font-medium">{weather.current?.temp}°F</span>
                  <span className="text-deep-brown/50">{weather.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* === Two Column Layout === */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Main Content (2/3 width) */}
            <div className="col-span-2 space-y-6">
              {/* Next Task Card */}
              {nextTask && nextTask.task ? (
                <div className="bg-lawn rounded-2xl p-6 shadow-lg shadow-lawn/10">
                  <div className="flex items-start gap-5">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={markTaskDone}
                      className="w-10 h-10 mt-0.5 rounded-xl border-2 border-white/40 flex items-center justify-center flex-shrink-0 hover:bg-white/20 hover:border-white/60 active:scale-95 transition-all group"
                    >
                      <svg className="w-5 h-5 text-white/0 group-hover:text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    {/* Task content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-white/70 bg-white/15 px-2.5 py-1 rounded-full">
                          Next Up
                        </span>
                        <span className="text-white/50 text-sm">
                          {nextTask.month} · {nextTask.week}
                        </span>
                      </div>
                      <p className="text-white font-semibold text-xl leading-snug mt-2">
                        {nextTask.task}
                      </p>
                    </div>
                  </div>
                </div>
              ) : nextTask ? (
                <div className="bg-lawn/10 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-lawn/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-display font-bold text-deep-brown text-xl">All tasks complete!</p>
                  <p className="text-deep-brown/60 mt-1">{nextTask.completedCount} tasks done this season</p>
                </div>
              ) : (
                <Link
                  href="/sandbox"
                  className="block bg-lawn rounded-2xl p-6 hover:bg-lawn/95 transition-colors shadow-lg shadow-lawn/10"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm font-medium">Get Started</p>
                      <p className="text-white font-bold text-xl">Create Your 90-Day Plan</p>
                    </div>
                  </div>
                </Link>
              )}

              {/* Ask Larry Chat Card */}
              <div className="bg-white rounded-2xl border border-deep-brown/10 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-lawn/10 rounded-xl flex items-center justify-center text-2xl">
                    🧑‍🌾
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-deep-brown text-lg">Ask Larry</h3>
                      <button
                        type="button"
                        onClick={() => setShowLarryInfo(true)}
                        className="w-5 h-5 bg-deep-brown/10 rounded-full flex items-center justify-center text-xs font-bold text-deep-brown/50 hover:bg-deep-brown/20 hover:text-deep-brown/70 transition-colors"
                      >
                        ?
                      </button>
                    </div>
                    <p className="text-sm text-deep-brown/60">Your personal lawn expert</p>
                  </div>
                </div>
                <form onSubmit={handleChatSubmit} className="flex gap-3">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border border-deep-brown/10 rounded-xl focus-within:border-lawn focus-within:ring-2 focus-within:ring-lawn/10 bg-cream/30">
                    <button
                      type="button"
                      onClick={() => chatFileInputRef.current?.click()}
                      className="p-1.5 text-deep-brown/40 hover:text-lawn transition-all rounded-lg hover:bg-lawn/10"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Why are there brown patches in my lawn?"
                      className="flex-1 text-base bg-transparent focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!chatInput.trim() && chatImages.length === 0}
                    className="px-6 py-3.5 bg-lawn text-white font-semibold rounded-xl hover:bg-lawn/90 disabled:bg-deep-brown/10 disabled:text-deep-brown/30 transition-colors"
                  >
                    Ask
                  </button>
                </form>
              </div>

              {/* Quick Actions Row */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleOpenActivityModal}
                  className="bg-white rounded-2xl border border-deep-brown/10 p-5 flex flex-col items-center gap-3 hover:border-lawn/30 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-lawn/10 rounded-xl flex items-center justify-center group-hover:bg-lawn/20 transition-colors">
                    <svg className="w-6 h-6 text-lawn" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-deep-brown">Log Activity</span>
                </button>
                <Link
                  href="/chat"
                  className="bg-white rounded-2xl border border-deep-brown/10 p-5 flex flex-col items-center gap-3 hover:border-deep-brown/20 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-deep-brown/5 rounded-xl flex items-center justify-center group-hover:bg-deep-brown/10 transition-colors">
                    <svg className="w-6 h-6 text-deep-brown/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-deep-brown">Chat History</span>
                </Link>
              </div>
            </div>

            {/* Right Column - Plan Progress & Stats (1/3 width) */}
            <div className="space-y-4">
              {/* Progress Card */}
              {nextTask && nextTask.totalTasks > 0 && (
                <div className="bg-white rounded-2xl border border-deep-brown/10 p-5">
                  <h3 className="font-display font-bold text-deep-brown mb-4">90-Day Progress</h3>

                  {/* Large Progress Ring */}
                  <div className="flex justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="#E8E4DC" strokeWidth="2.5" />
                        <circle
                          cx="18" cy="18" r="15" fill="none" stroke="#4A6741" strokeWidth="2.5"
                          strokeDasharray={`${(nextTask.completedCount / nextTask.totalTasks) * 94.2} 94.2`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-deep-brown">
                          {Math.round((nextTask.completedCount / nextTask.totalTasks) * 100)}%
                        </span>
                        <span className="text-xs text-deep-brown/50">complete</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-center border-t border-deep-brown/10 pt-4">
                    <div>
                      <p className="text-2xl font-bold text-lawn">{nextTask.completedCount}</p>
                      <p className="text-xs text-deep-brown/50">Done</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-deep-brown">{nextTask.totalTasks - nextTask.completedCount}</p>
                      <p className="text-xs text-deep-brown/50">Remaining</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-terracotta">{nextTask.totalTasks}</p>
                      <p className="text-xs text-deep-brown/50">Total</p>
                    </div>
                  </div>

                  {/* View Full Plan Link */}
                  <button
                    type="button"
                    onClick={() => document.getElementById('desktop-full-plan')?.scrollIntoView({ behavior: 'smooth' })}
                    className="block mt-4 w-full text-center text-sm text-lawn font-medium hover:text-lawn/80 transition-colors"
                  >
                    View Full Plan →
                  </button>
                </div>
              )}

              {/* Recent Activity Preview */}
              <div className="bg-white rounded-2xl border border-deep-brown/10 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-deep-brown">Recent Activity</h3>
                  {recentActivitiesCount > 0 && (
                    <span className="text-xs font-medium bg-deep-brown/5 text-deep-brown/60 px-2 py-1 rounded-full">
                      {recentActivitiesCount} this week
                    </span>
                  )}
                </div>
                {recentActivities.length > 0 ? (
                  <div className="space-y-2">
                    {recentActivities.slice(0, 3).map((activity) => (
                      <button
                        key={activity.id}
                        type="button"
                        onClick={() => handleEditActivity(activity)}
                        className="w-full flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-cream/50 transition-colors text-left group"
                      >
                        <div className="w-8 h-8 bg-lawn/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-deep-brown truncate">{getActivityName(activity.type)}</p>
                          <p className="text-xs text-deep-brown/50">{new Date(activity.date).toLocaleDateString()}</p>
                        </div>
                        <svg className="w-4 h-4 text-deep-brown/30 group-hover:text-deep-brown/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-deep-brown/50">No recent activity</p>
                    <button
                      type="button"
                      onClick={handleOpenActivityModal}
                      className="text-sm text-lawn font-medium mt-1 hover:text-lawn/80"
                    >
                      Log your first activity
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* === Full 90-Day Plan Section === */}
          <div id="desktop-full-plan" className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-deep-brown">Your Complete 90-Day Plan</h2>
              {nextTask && nextTask.totalTasks > 0 && (
                <span className="text-sm text-deep-brown/50">
                  {nextTask.completedCount} of {nextTask.totalTasks} tasks complete
                </span>
              )}
            </div>
            <LawnPlan />
          </div>
        </div>
      </div>

      {/* Signup Bottom Sheet (Mobile) */}
      {showSignupSheet && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => handleDismissSignup(true)}
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
                  { icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z", text: "Snap a photo, get instant diagnosis" },
                  { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", text: "Ask Larry anything about your lawn" },
                  { icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", text: "Weekly reminders so you never miss a task" },
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
                onClick={() => handleDismissSignup(true)}
                className="block w-full py-3 text-deep-brown/60 font-medium text-center active:text-deep-brown transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal (Desktop) */}
      {showSignupSheet && (
        <div className="fixed inset-0 z-50 hidden lg:flex items-center justify-center p-8">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => handleDismissSignup(true)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full animate-fade-in p-8">
            {/* Close button */}
            <button
              type="button"
              onClick={() => handleDismissSignup(true)}
              className="absolute top-4 right-4 p-2 text-deep-brown/40 hover:text-deep-brown transition-colors rounded-lg hover:bg-deep-brown/5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div className="w-20 h-20 bg-lawn/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>

            {/* Content */}
            <h2 className="font-display text-3xl font-bold text-deep-brown text-center mb-3">
              Love your plan?
            </h2>
            <p className="text-deep-brown/70 text-center text-lg mb-8">
              Create a free account to save it, get reminders, and sync across all your devices.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {[
                { icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z", text: "Snap a photo, get instant diagnosis" },
                { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", text: "Ask Larry anything about your lawn" },
                { icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", text: "Weekly reminders so you never miss a task" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-lawn/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <span className="text-deep-brown text-lg">{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <Link
              href="/signup"
              className="block w-full py-4 bg-lawn text-white font-bold text-center rounded-2xl hover:bg-lawn/90 transition-colors mb-3"
            >
              Sign Up Free
            </Link>
            <button
              type="button"
              onClick={() => handleDismissSignup(true)}
              className="block w-full py-3 text-deep-brown/60 font-medium text-center hover:text-deep-brown transition-colors"
            >
              Maybe Later
            </button>
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

      {/* Who's Larry? Popup */}
      {showLarryInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLarryInfo(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowLarryInfo(false)}
              className="absolute top-4 right-4 p-1.5 text-deep-brown/40 hover:text-deep-brown transition-colors rounded-lg hover:bg-deep-brown/5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Larry avatar */}
            <div className="w-16 h-16 bg-lawn/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              🧑‍🌾
            </div>

            {/* Content */}
            <h2 className="font-display text-xl font-bold text-deep-brown text-center mb-2">
              Who&apos;s Larry?
            </h2>
            <p className="text-deep-brown/70 text-center mb-4">
              Larry is your personal lawn care expert, powered by AI.
            </p>

            {/* What Larry knows */}
            <div className="bg-cream/50 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-deep-brown mb-2">Larry is trained on:</p>
              <ul className="space-y-2">
                {[
                  "Photo analysis of your lawn (weeds, disease, damage)",
                  "Regional grass types & climate zones",
                  "Seasonal fertilizer & weed control schedules",
                  "Watering, mowing & aeration best practices",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-deep-brown/70">
                    <svg className="w-4 h-4 text-lawn flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-deep-brown/50 text-center">
              Ask Larry anything — he&apos;s here to help you get the lawn of your dreams.
            </p>

            {/* CTA */}
            <button
              type="button"
              onClick={() => setShowLarryInfo(false)}
              className="mt-4 w-full bg-lawn text-white font-semibold py-3 rounded-xl hover:bg-lawn/90 active:scale-[0.98] transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-cream flex flex-col pt-[env(safe-area-inset-top)]">
          <div className="flex-1 px-4 py-4 space-y-4 animate-pulse">
            {/* Hero status skeleton */}
            <div className="bg-white rounded-2xl border border-deep-brown/10 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-deep-brown/10 rounded" />
                  <div className="h-6 w-32 bg-deep-brown/10 rounded" />
                </div>
                <div className="h-10 w-16 bg-deep-brown/10 rounded-xl" />
              </div>
            </div>
            {/* Next up skeleton */}
            <div className="h-20 bg-lawn/20 rounded-2xl" />
            {/* Chat input skeleton */}
            <div className="h-14 bg-white rounded-2xl border border-deep-brown/10" />
            {/* Activity preview skeleton */}
            <div className="bg-white rounded-2xl border border-deep-brown/10 p-4 space-y-3">
              <div className="h-5 w-32 bg-deep-brown/10 rounded" />
              <div className="h-12 bg-cream rounded-xl" />
              <div className="h-12 bg-cream rounded-xl" />
            </div>
            {/* Tasks preview skeleton */}
            <div className="bg-white rounded-2xl border border-deep-brown/10 p-4 space-y-3">
              <div className="h-5 w-24 bg-deep-brown/10 rounded" />
              <div className="h-10 bg-cream rounded-xl" />
              <div className="h-10 bg-cream rounded-xl" />
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
