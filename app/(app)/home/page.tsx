"use client";

import { useState, useCallback, useRef, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CalendarActivity, ChatImage, ChatMessage, LawnProduct, ApplicationResult } from "@/types";
import { useProfile } from "@/hooks/useProfile";
import { useTodos } from "@/hooks/useTodos";
import { useCalendar } from "@/hooks/useCalendar";
import { useWeather } from "@/hooks/useWeather";
import { useSoilTemp } from "@/hooks/useSoilTemp";
import { usePhotos } from "@/hooks/usePhotos";
import { useProducts } from "@/hooks/useProducts";
import { useSpreaderSettings } from "@/hooks/useSpreaderSettings";
import YardPhotoModal from "@/components/home/YardPhotoModal";
import RecentActivities from "@/components/home/RecentActivities";
import TodoList from "@/components/home/TodoList";
import ActivityModal from "@/components/home/ActivityModal";
import TodoModal from "@/components/home/TodoModal";
import OnboardingModal from "@/components/home/OnboardingModal";
import { LawnPlan } from "@/components/home/LawnPlan";
import { AccountCompletionCard } from "@/components/home/AccountCompletionCard";
import { CreateAccountModal } from "@/components/CreateAccountModal";
import { getSamplePlan, type PlanMonth } from "@/lib/samplePlan";
import { getHardinessZone } from "@/lib/zip-climate";

type MobileView = "home" | "plan" | "activity" | "spreader" | "chat";

function HomePageContent() {
  const { profile, isSetUp, saveProfile, isAuthenticated } = useProfile();
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const { activities, addActivity, deleteActivity, updateActivity } = useCalendar();
  const { weather, loading: weatherLoading } = useWeather(profile?.zipCode);
  const { soilTemp, loading: soilTempLoading } = useSoilTemp(profile?.zipCode);
  const { photos, addPhoto } = usePhotos();
  const { products, addProduct } = useProducts();
  const { userProducts, addUserProduct } = useProducts();
  const {
    userSpreader,
    hasSpreader,
    lawnSqFt,
    calculateApplication,
    searchCuratedProducts,
    getAllProducts,
  } = useSpreaderSettings(profile);

  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q");
  const showOnboarding = searchParams.get("onboarding") === "true";

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingData, setOnboardingData] = useState<{ zipCode?: string; grassType?: string } | null>(null);
  const [showSignupSheet, setShowSignupSheet] = useState(false);
  const [signupDismissed, setSignupDismissed] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [accountCardDismissed, setAccountCardDismissed] = useState(false);

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
      router.replace("/home", { scroll: false });
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollArrow, setShowScrollArrow] = useState(true);

  // Spreader calculator state
  const [spreaderViewMode, setSpreaderViewMode] = useState<"search" | "manual" | "result">("search");
  const [spreaderSearchQuery, setSpreaderSearchQuery] = useState("");
  const [spreaderSelectedProduct, setSpreaderSelectedProduct] = useState<LawnProduct | null>(null);
  const [spreaderResult, setSpreaderResult] = useState<ApplicationResult | null>(null);
  const [spreaderCustomSqFt, setSpreaderCustomSqFt] = useState<string>("");
  const [spreaderSelectedRate, setSpreaderSelectedRate] = useState<"low" | "high">("low");
  const [spreaderManualName, setSpreaderManualName] = useState("");
  const [spreaderManualBrand, setSpreaderManualBrand] = useState("");
  const [spreaderManualRate, setSpreaderManualRate] = useState("");
  const [spreaderManualCategory, setSpreaderManualCategory] = useState<LawnProduct["category"]>("fertilizer");
  const [spreaderManualBagSize, setSpreaderManualBagSize] = useState("");
  const [spreaderManualNpk, setSpreaderManualNpk] = useState("");

  // Inline chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInputInline, setChatInputInline] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatPendingImages, setChatPendingImages] = useState<ChatImage[]>([]);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const chatTextareaRef = useRef<HTMLTextAreaElement>(null);
  const chatInlineFileRef = useRef<HTMLInputElement>(null);
  const chatInlineCameraRef = useRef<HTMLInputElement>(null);

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

        // Count total and completed (only count keys that match actual plan tasks)
        let totalTasks = 0;
        let completedCount = 0;
        for (let mIdx = 0; mIdx < plan.length; mIdx++) {
          for (let wIdx = 0; wIdx < plan[mIdx].weeks.length; wIdx++) {
            for (let tIdx = 0; tIdx < plan[mIdx].weeks[wIdx].tasks.length; tIdx++) {
              totalTasks++;
              if (completed[`${mIdx}-${wIdx}-${tIdx}`]) {
                completedCount++;
              }
            }
          }
        }

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
  // Show signup prompt after browsing (only for guests)
  useEffect(() => {
    // Don't show for authenticated users
    if (isAuthenticated) return;

    const dismissed = localStorage.getItem("lawnhq_signup_dismissed");
    if (dismissed) {
      setSignupDismissed(true);
      return;
    }
    const timer = setTimeout(() => {
      setShowSignupSheet(true);
    }, 8000); // Show after 8 seconds
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  // Track scroll position to show/hide the down arrow
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const hasOverflow = el.scrollHeight > el.clientHeight + 10;
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      setShowScrollArrow(hasOverflow && !nearBottom);
    };

    // Delay initial check so content has time to render
    const timer = setTimeout(handleScroll, 300);

    el.addEventListener("scroll", handleScroll, { passive: true });

    // Re-check when content size changes (images load, dynamic content)
    const ro = new ResizeObserver(handleScroll);
    ro.observe(el);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", handleScroll);
      ro.disconnect();
    };
  }, []);

  const handleDismissSignup = (permanent: boolean) => {
    setShowSignupSheet(false);
    if (permanent) {
      localStorage.setItem("lawnhq_signup_dismissed", "true");
      setSignupDismissed(true);
    }
  };

  // Account card helpers
  const handleDismissAccountCard = () => {
    setAccountCardDismissed(true);
    sessionStorage.setItem("lawnhq_account_card_dismissed", "true");
  };

  useEffect(() => {
    const dismissed = sessionStorage.getItem("lawnhq_account_card_dismissed");
    if (dismissed) setAccountCardDismissed(true);
  }, []);

  // Get guest data from localStorage
  const guestData = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem("lawnhq_guest");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }, []);

  // Show account card for guests with saved data
  const showAccountCard = !isAuthenticated && !accountCardDismissed && guestData?.email;

  const handleAccountCreated = () => {
    setShowCreateAccountModal(false);
    // Page will auto-refresh due to auth state change
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

  // Inline chat handlers
  const handleInlineChatSend = async (messageText?: string) => {
    const text = messageText || chatInputInline.trim();
    if ((!text && chatPendingImages.length === 0) || isChatLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text || "What can you tell me about this?",
      timestamp: new Date().toISOString(),
      images: chatPendingImages.length > 0 ? [...chatPendingImages] : undefined,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInputInline("");
    const imagesToSend = [...chatPendingImages];
    setChatPendingImages([]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage].map((m) => ({
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
      if (data.error) throw new Error(data.error);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I had trouble processing that. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleInlineChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInlineChatSend();
    }
  };

  const handleInlineChatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const newImages = await Promise.all(Array.from(files).map(processChatImage));
      setChatPendingImages((prev) => [...prev, ...newImages].slice(0, 4));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to upload image");
    }
    e.target.value = "";
  };

  const removeInlineChatImage = (imageId: string) => {
    setChatPendingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  // Scroll to bottom of chat on new messages
  useEffect(() => {
    if (mobileView === "chat") {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, mobileView]);

  // Auto-resize inline chat textarea
  useEffect(() => {
    if (chatTextareaRef.current) {
      chatTextareaRef.current.style.height = "auto";
      chatTextareaRef.current.style.height = `${Math.min(chatTextareaRef.current.scrollHeight, 120)}px`;
    }
  }, [chatInputInline]);

  // Check if profile is incomplete (has zip/grass but missing optional fields)
  const isProfileIncomplete = (() => {
    if (!profile || !profile.zipCode) return false; // No profile at all — different CTA
    const optionalFields = [
      profile.lawnGoal,
      profile.mowerType,
      profile.spreaderType,
      profile.irrigationSystem,
      profile.lawnAge,
      profile.soilType,
    ];
    const filledCount = optionalFields.filter(Boolean).length;
    return filledCount < 4; // Show CTA if less than 4 of 6 optional fields filled
  })();

  const [profileCtaDismissed, setProfileCtaDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("lawnhq_profile_cta_dismissed");
    if (dismissed) setProfileCtaDismissed(true);
  }, []);

  const handleDismissProfileCta = () => {
    setProfileCtaDismissed(true);
    localStorage.setItem("lawnhq_profile_cta_dismissed", "true");
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

  // Spreader calculator helpers
  const spreaderSearchResults = useMemo(() => {
    if (!spreaderSearchQuery.trim()) return [];
    const curated = searchCuratedProducts(spreaderSearchQuery);
    const userMatches = userProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(spreaderSearchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(spreaderSearchQuery.toLowerCase())
    );
    const all = [...curated, ...userMatches];
    const seen = new Set<string>();
    return all.filter((p) => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
  }, [spreaderSearchQuery, searchCuratedProducts, userProducts]);

  const allSpreaderProducts = useMemo(() => getAllProducts(), [getAllProducts]);

  const handleSpreaderSelectProduct = (product: LawnProduct) => {
    setSpreaderSelectedProduct(product);
    const sqFt = spreaderCustomSqFt ? parseInt(spreaderCustomSqFt) : undefined;
    const calcResult = calculateApplication(product, sqFt);
    setSpreaderResult(calcResult);
    setSpreaderViewMode("result");
  };

  const handleSpreaderManualCalculate = () => {
    const rate = parseFloat(spreaderManualRate);
    if (isNaN(rate) || rate <= 0) return;
    const sqFt = spreaderCustomSqFt ? parseInt(spreaderCustomSqFt) : undefined;
    const manualProduct: LawnProduct = {
      id: `manual-${Date.now()}`,
      name: spreaderManualName || "Custom Product",
      brand: spreaderManualBrand || "Unknown",
      category: spreaderManualCategory,
      applicationRate: {
        lbsPer1000sqft: rate,
        bagSize: spreaderManualBagSize ? parseFloat(spreaderManualBagSize) : undefined,
      },
      npk: spreaderManualNpk || undefined,
      source: "user",
    };
    const calcResult = calculateApplication(manualProduct, sqFt);
    setSpreaderSelectedProduct(manualProduct);
    setSpreaderResult(calcResult);
    setSpreaderViewMode("result");
  };

  const handleSpreaderReset = () => {
    setSpreaderViewMode("search");
    setSpreaderSelectedProduct(null);
    setSpreaderResult(null);
    setSpreaderSearchQuery("");
    setSpreaderManualName("");
    setSpreaderManualBrand("");
    setSpreaderManualRate("");
    setSpreaderManualBagSize("");
    setSpreaderManualNpk("");
    setSpreaderSelectedRate("low");
  };

  const getSpreaderDisplayValues = () => {
    if (!spreaderResult || !spreaderSelectedProduct) return null;
    const sqFt = spreaderCustomSqFt ? parseInt(spreaderCustomSqFt) : lawnSqFt;
    const rate = spreaderSelectedRate === "low" ? spreaderResult.lbsPer1000sqftLow : spreaderResult.lbsPer1000sqftHigh;
    const totalLbsNeeded = Math.round((rate * sqFt) / 1000 * 10) / 10;
    let bagsNeeded: number | undefined;
    if (spreaderSelectedProduct.applicationRate.bagSize) {
      bagsNeeded = Math.ceil(totalLbsNeeded / spreaderSelectedProduct.applicationRate.bagSize);
    }
    return { rate, totalLbsNeeded, bagsNeeded };
  };

  const spreaderDisplayValues = getSpreaderDisplayValues();

  // Recalculate spreader result when the selected spreader changes
  useEffect(() => {
    if (spreaderSelectedProduct && userSpreader) {
      const sqFt = spreaderCustomSqFt ? parseInt(spreaderCustomSqFt) : undefined;
      const newResult = calculateApplication(spreaderSelectedProduct, sqFt);
      if (newResult) setSpreaderResult(newResult);
    }
  }, [userSpreader]);

  return (
    <>
      {/* Mobile Layout - Lawn Status Dashboard */}
      <div className="fixed inset-0 bg-cream flex flex-col lg:hidden">
        {/* Safe area top */}
        <div className="bg-cream pt-[env(safe-area-inset-top)]" />

        {/* HOME: Scrollable content */}
        {mobileView === "home" && <div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative">
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
                {/* Weather + Zone badge */}
                <div className="flex flex-col items-end gap-1">
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
                  {profile?.zipCode && (
                    <span className="text-xs text-deep-brown/50">Zone {getHardinessZone(profile.zipCode).toUpperCase()}</span>
                  )}
                </div>
              </div>

              {/* Soil temp inline */}
              {soilTemp && !soilTempLoading && (
                <div className="mt-3 flex items-center gap-2 text-sm text-deep-brown/70">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                  </svg>
                  <span>Soil: {soilTemp.current}°F</span>
                </div>
              )}
            </div>

            {/* === Profile Completion CTA === */}
            {isProfileIncomplete && !profileCtaDismissed && (
              <Link
                href="/profile"
                className="block bg-gradient-to-r from-terracotta/10 to-ochre/10 rounded-2xl border border-terracotta/20 p-4 active:scale-[0.98] transition-transform relative group"
              >
                {/* Dismiss button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDismissProfileCta();
                  }}
                  className="absolute top-2.5 right-2.5 p-1 rounded-full text-deep-brown/30 hover:text-deep-brown/60 hover:bg-white/60 transition-colors z-10"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-terracotta/15 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-semibold text-deep-brown text-sm">Finish your profile</p>
                    <p className="text-xs text-deep-brown/55 mt-0.5">Better details = better advice from Larry.</p>
                  </div>
                  <svg className="w-5 h-5 text-terracotta/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )}

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
                <p className="font-display font-bold text-deep-brown text-lg">All done — your lawn thanks you.</p>
                <p className="text-deep-brown/60 mt-1">{nextTask.completedCount} tasks crushed this season</p>
              </div>
            ) : (
              <Link
                href="/"
                className="block bg-lawn rounded-2xl p-5 shadow-lg shadow-lawn/20 active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">Let&apos;s get growing</p>
                    <p className="text-white font-bold text-lg">Build Your 90-Day Plan</p>
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
                      onMouseEnter={() => setShowLarryInfo(true)}
                      className="w-4 h-4 bg-deep-brown/10 rounded-full flex items-center justify-center text-[10px] font-bold text-deep-brown/50 hover:bg-deep-brown/20 hover:text-deep-brown/70 transition-colors"
                    >
                      ?
                    </button>
                  </div>
                  <p className="text-xs text-deep-brown/60">He knows his stuff. Promise.</p>
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

            {/* === Account Completion Card (Guests Only) === */}
            {showAccountCard && (
              <AccountCompletionCard
                guestEmail={guestData?.email || ""}
                zipCode={profile?.zipCode || guestData?.zipCode || ""}
                grassType={profile?.grassType || guestData?.grassType || ""}
                onCreateAccount={() => setShowCreateAccountModal(true)}
                onDismiss={handleDismissAccountCard}
              />
            )}

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
                <p className="text-xs text-deep-brown/50">Track what you&apos;ve done — it all adds up.</p>
              </div>
              <svg className="w-5 h-5 text-deep-brown/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Bottom padding for nav */}
            <div className="h-20" />
          </div>

          {/* Scroll Down Indicator */}
          {showScrollArrow && (
            <div className="sticky bottom-0 left-0 right-0 pointer-events-none flex flex-col items-center z-30 -mt-16">
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f8f6f3] to-transparent" />
              <button
                type="button"
                onClick={() => scrollContainerRef.current?.scrollBy({ top: 300, behavior: "smooth" })}
                className="pointer-events-auto relative mb-4 flex items-center justify-center w-10 h-10 rounded-full bg-[#7a8b6e] text-white shadow-lg animate-bounce cursor-pointer"
                aria-label="Scroll down for more"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>}

        {/* PLAN/ACTIVITY: Sub-view with header */}
        {(mobileView === "plan" || mobileView === "activity") && (
          <>
            <div className="bg-white border-b border-deep-brown/10">
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
            <div className="flex-1 overflow-y-auto p-4">
              {mobileView === "plan" && <LawnPlan onTaskToggle={findNextTask} />}
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
          </>
        )}

        {/* SPREADER: Spreader Calculator view */}
        {mobileView === "spreader" && (
          <>
            <div className="bg-white border-b border-deep-brown/10">
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
                <h1 className="font-display text-lg font-bold text-deep-brown">Spreader Calculator</h1>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {/* Spreader Selector - always visible */}
              <div className="bg-white rounded-2xl border border-deep-brown/10 p-4 mb-4">
                <label className="block text-xs font-medium text-deep-brown/60 mb-1.5">
                  {hasSpreader ? "Your Spreader" : "Select Your Spreader"}
                </label>
                <select
                  value={profile?.spreaderType || ""}
                  onChange={(e) => {
                    if (e.target.value) saveProfile({ spreaderType: e.target.value });
                  }}
                  className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-colors ${
                    hasSpreader
                      ? "bg-cream border-deep-brown/10 text-deep-brown focus:border-lawn"
                      : "bg-cream border-lawn text-deep-brown focus:border-lawn ring-2 ring-lawn/20"
                  }`}
                >
                  <option value="">Select spreader...</option>
                  <optgroup label="The Andersons">
                    <option value="andersons-lco-1000">The Andersons LCO-1000</option>
                    <option value="andersons-pacer-pro">The Andersons Pacer Pro</option>
                    <option value="andersons-yard-star-2150">The Andersons Yard Star 2150</option>
                    <option value="andersons-2000">The Andersons Model 2000</option>
                    <option value="andersons-sr">The Andersons SR</option>
                  </optgroup>
                  <optgroup label="Agri-Fab">
                    <option value="agri-fab-broadcast">Agri-Fab Broadcast (1-10)</option>
                    <option value="agri-fab-rotary">Agri-Fab Rotary</option>
                  </optgroup>
                  <optgroup label="Brinly">
                    <option value="brinly-broadcast">Brinly 20 Series Push Broadcast (0-30)</option>
                  </optgroup>
                  <optgroup label="Chapin">
                    <option value="chapin-broadcast">Chapin Broadcast (0-30)</option>
                  </optgroup>
                  <optgroup label="Craftsman">
                    <option value="craftsman-broadcast">Craftsman Broadcast (1-10)</option>
                  </optgroup>
                  <optgroup label="EarthWay">
                    <option value="earthway-3400-hand">EarthWay 3400 Hand Spreader (1-3)</option>
                    <option value="earthway-broadcast">EarthWay Broadcast (0-30)</option>
                    <option value="earthway-drop">Earthway Drop</option>
                    <option value="earthway-rotary">Earthway Rotary</option>
                  </optgroup>
                  <optgroup label="Echo">
                    <option value="echo-broadcast">Echo Broadcast</option>
                  </optgroup>
                  <optgroup label="Lesco">
                    <option value="lesco-broadcast">Lesco Broadcast</option>
                    <option value="lesco-rotary-numbers">Lesco Rotary (numbers)</option>
                    <option value="lesco-rotary-letters">Lesco Rotary (letters)</option>
                  </optgroup>
                  <optgroup label="Precision">
                    <option value="precision-broadcast">Precision Broadcast (1-10)</option>
                  </optgroup>
                  <optgroup label="Prizelawn">
                    <option value="prizelawn-bf1-cbr">Prizelawn BF1/CBR/III/CBR IV</option>
                    <option value="prizelawn-lf-ii">Prizelawn LF II</option>
                  </optgroup>
                  <optgroup label="Scotts">
                    <option value="scotts-broadcast">Scotts Broadcast (2-15)</option>
                    <option value="scotts-hand-held-broadcast">Scotts Hand-Held Broadcast</option>
                    <option value="scotts-wizz">Scotts Wizz Hand Broadcast Spreader</option>
                    <option value="scotts-rotary-consumer">Scotts Rotary (Consumer)</option>
                    <option value="scotts-drop-consumer">Scotts Drop (Consumer)</option>
                    <option value="scotts-easygreen">Scotts EasyGreen (Consumer)</option>
                    <option value="scotts-rba-pro-rotary">Scotts RBA Pro Rotary</option>
                  </optgroup>
                  <optgroup label="Spyker">
                    <option value="spyker-broadcast">Spyker Broadcast</option>
                    <option value="spyker-rotary">Spyker Rotary</option>
                  </optgroup>
                </select>
              </div>

              {/* Lawn Size Override - always visible when spreader selected */}
              {hasSpreader && (
                <div className="bg-white rounded-2xl border border-deep-brown/10 p-4 mb-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-deep-brown/70">
                      Lawn: <span className="font-medium text-deep-brown">{spreaderCustomSqFt || lawnSqFt.toLocaleString()} sq ft</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={spreaderCustomSqFt}
                        onChange={(e) => setSpreaderCustomSqFt(e.target.value)}
                        placeholder={lawnSqFt.toString()}
                        className="w-24 px-3 py-1.5 text-sm bg-cream border border-deep-brown/10 rounded-lg outline-none focus:border-lawn"
                      />
                      {spreaderCustomSqFt && (
                        <button onClick={() => setSpreaderCustomSqFt("")} className="text-xs text-deep-brown/50">Reset</button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {!hasSpreader ? (
                <div className="bg-white rounded-2xl border border-deep-brown/10 p-6 text-center">
                  <p className="text-sm text-deep-brown/50">Pick your spreader above to get started.</p>
                </div>
              ) : spreaderViewMode === "result" && spreaderResult ? (
                <div className="space-y-4">
                  {/* Result Card */}
                  <div className="bg-white rounded-2xl border border-deep-brown/10 p-5">
                    <p className="text-xs text-deep-brown/50 uppercase tracking-wide text-center mb-4">
                      {userSpreader?.spreaderName} Settings
                    </p>
                    <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                      <button
                        onClick={() => setSpreaderSelectedRate("low")}
                        className={`bg-lawn/10 rounded-xl p-4 transition-all ${
                          spreaderSelectedRate === "low"
                            ? "border-2 border-lawn ring-2 ring-lawn/20 shadow-lg"
                            : "border border-lawn/30"
                        }`}
                      >
                        <p className="text-xs font-medium text-lawn uppercase tracking-wide mb-1">Low Rate</p>
                        <div className="text-3xl font-bold text-lawn mb-1">{spreaderResult.spreaderSettingLow}</div>
                        <p className="text-xs text-lawn/70">{spreaderResult.lbsPer1000sqftLow} lbs/1k sq ft</p>
                        {spreaderSelectedRate === "low" && <p className="text-xs text-lawn font-medium mt-1">✓ Selected</p>}
                      </button>
                      <button
                        onClick={() => setSpreaderSelectedRate("high")}
                        className={`bg-terracotta/10 rounded-xl p-4 transition-all ${
                          spreaderSelectedRate === "high"
                            ? "border-2 border-terracotta ring-2 ring-terracotta/20 shadow-lg"
                            : "border border-terracotta/30"
                        }`}
                      >
                        <p className="text-xs font-medium text-terracotta uppercase tracking-wide mb-1">High Rate</p>
                        <div className="text-3xl font-bold text-terracotta mb-1">{spreaderResult.spreaderSettingHigh}</div>
                        <p className="text-xs text-terracotta/70">{spreaderResult.lbsPer1000sqftHigh} lbs/1k sq ft</p>
                        {spreaderSelectedRate === "high" && <p className="text-xs text-terracotta font-medium mt-1">✓ Selected</p>}
                      </button>
                    </div>
                    <p className="text-xs text-deep-brown/50 text-center mt-3">
                      Use <span className="text-lawn font-medium">Low</span> for light feeding. <span className="text-terracotta font-medium">High</span> for established lawns.
                    </p>

                    {/* Product Info */}
                    <div className="border-t border-deep-brown/10 mt-4 pt-4">
                      <h3 className="font-medium text-deep-brown text-center text-sm mb-3">{spreaderSelectedProduct?.name}</h3>
                      <div className="flex justify-center gap-6 text-xs">
                        <div className="text-center">
                          <p className="text-deep-brown/50">Rate</p>
                          <p className="font-medium text-deep-brown">{spreaderDisplayValues?.rate} lbs/1k</p>
                        </div>
                        <div className="text-center">
                          <p className="text-deep-brown/50">Total</p>
                          <p className="font-medium text-deep-brown">{spreaderDisplayValues?.totalLbsNeeded} lbs</p>
                        </div>
                        {spreaderDisplayValues?.bagsNeeded && (
                          <div className="text-center">
                            <p className="text-deep-brown/50">Bags</p>
                            <p className="font-medium text-deep-brown">{spreaderDisplayValues.bagsNeeded}</p>
                          </div>
                        )}
                        {spreaderSelectedProduct?.npk && (
                          <div className="text-center">
                            <p className="text-deep-brown/50">NPK</p>
                            <p className="font-medium text-deep-brown">{spreaderSelectedProduct.npk}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSpreaderReset}
                    className="w-full py-3 bg-lawn text-white font-bold rounded-xl hover:bg-lawn/90 active:scale-[0.98] transition-all"
                  >
                    Calculate Another
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Tab Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSpreaderViewMode("search")}
                      className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                        spreaderViewMode === "search"
                          ? "bg-lawn text-white"
                          : "bg-white border border-deep-brown/10 text-deep-brown/70"
                      }`}
                    >
                      Search Products
                    </button>
                    <button
                      onClick={() => setSpreaderViewMode("manual")}
                      className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                        spreaderViewMode === "manual"
                          ? "bg-lawn text-white"
                          : "bg-white border border-deep-brown/10 text-deep-brown/70"
                      }`}
                    >
                      Manual Entry
                    </button>
                  </div>

                  {spreaderViewMode === "search" ? (
                    <div className="bg-white rounded-2xl border border-deep-brown/10 p-4">
                      <input
                        type="text"
                        value={spreaderSearchQuery}
                        onChange={(e) => setSpreaderSearchQuery(e.target.value)}
                        placeholder="Search products (e.g., Milorganite...)"
                        className="w-full px-4 py-3 bg-cream border border-deep-brown/10 rounded-xl text-deep-brown placeholder-deep-brown/40 outline-none focus:border-lawn mb-3"
                      />
                      {spreaderSearchQuery && spreaderSearchResults.length > 0 ? (
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {spreaderSearchResults.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => handleSpreaderSelectProduct(product)}
                              className="w-full p-3 bg-cream hover:bg-cream/70 rounded-xl text-left transition-colors"
                            >
                              <p className="font-medium text-deep-brown text-sm">{product.name}</p>
                              <p className="text-xs text-deep-brown/50">{product.brand}{product.npk && ` · ${product.npk}`}</p>
                            </button>
                          ))}
                        </div>
                      ) : spreaderSearchQuery ? (
                        <p className="text-center text-deep-brown/50 py-6 text-sm">
                          No products found. Try{" "}
                          <button onClick={() => setSpreaderViewMode("manual")} className="text-lawn underline">manual entry</button>.
                        </p>
                      ) : (
                        <div>
                          <p className="text-xs text-deep-brown/50 mb-2">Popular products:</p>
                          <div className="space-y-2 max-h-72 overflow-y-auto">
                            {allSpreaderProducts.slice(0, 15).map((product) => (
                              <button
                                key={product.id}
                                onClick={() => handleSpreaderSelectProduct(product)}
                                className="w-full p-3 bg-cream hover:bg-cream/70 rounded-xl text-left transition-colors"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium text-deep-brown text-sm">{product.name}</p>
                                    <p className="text-xs text-deep-brown/50">{product.brand}</p>
                                  </div>
                                  <p className="text-xs text-deep-brown/50">{product.applicationRate.lbsPer1000sqft} lbs/1k</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-deep-brown/10 p-4">
                      <p className="text-xs text-deep-brown/60 mb-3">Enter the application rate from your product label.</p>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-deep-brown/70 mb-1">Rate (lbs/1,000 sq ft) *</label>
                          <input
                            type="number" step="0.1" value={spreaderManualRate}
                            onChange={(e) => setSpreaderManualRate(e.target.value)}
                            placeholder="e.g., 3.5"
                            className="w-full px-3 py-2.5 bg-cream border border-deep-brown/10 rounded-xl text-deep-brown placeholder-deep-brown/40 outline-none focus:border-lawn text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-deep-brown/70 mb-1">Product Name</label>
                            <input type="text" value={spreaderManualName} onChange={(e) => setSpreaderManualName(e.target.value)} placeholder="Optional"
                              className="w-full px-3 py-2.5 bg-cream border border-deep-brown/10 rounded-xl text-deep-brown placeholder-deep-brown/40 outline-none focus:border-lawn text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-deep-brown/70 mb-1">Bag Size (lbs)</label>
                            <input type="number" step="0.1" value={spreaderManualBagSize} onChange={(e) => setSpreaderManualBagSize(e.target.value)} placeholder="Optional"
                              className="w-full px-3 py-2.5 bg-cream border border-deep-brown/10 rounded-xl text-deep-brown placeholder-deep-brown/40 outline-none focus:border-lawn text-sm" />
                          </div>
                        </div>
                        <button
                          onClick={handleSpreaderManualCalculate}
                          disabled={!spreaderManualRate || parseFloat(spreaderManualRate) <= 0}
                          className="w-full py-3 bg-lawn hover:bg-lawn/90 disabled:bg-deep-brown/20 text-white font-bold rounded-xl transition-colors active:scale-[0.98]"
                        >
                          Calculate Setting
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* CHAT: Inline chat view */}
        {mobileView === "chat" && (
          <>
            <div className="bg-white border-b border-deep-brown/10">
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
                <div className="w-9 h-9 bg-lawn/10 rounded-xl flex items-center justify-center text-lg">🧑‍🌾</div>
                <div className="flex-1">
                  <h1 className="font-semibold text-deep-brown">Larry</h1>
                  <p className="text-xs text-deep-brown/50">Your lawn expert</p>
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
                {chatMessages.length === 0 && !isChatLoading && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-lawn/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl">🧑‍🌾</div>
                    <h2 className="font-display text-xl font-bold text-deep-brown mb-2">Hey, I&apos;m Larry!</h2>
                    <p className="text-deep-brown/60 max-w-xs mx-auto">Your personal lawn expert. Ask me anything or snap a photo of your lawn for diagnosis.</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                      {["Why is my grass turning brown?", "When should I fertilize?", "How often should I water?"].map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleInlineChatSend(suggestion)}
                          className="px-4 py-2 bg-white border border-deep-brown/10 rounded-full text-sm text-deep-brown/70 hover:border-lawn/30 hover:text-lawn active:scale-95 transition-all"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 bg-lawn/10 rounded-xl flex items-center justify-center text-sm flex-shrink-0">🧑‍🌾</div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user" ? "bg-lawn text-white rounded-br-md" : "bg-white border border-deep-brown/10 text-deep-brown rounded-bl-md"}`}>
                      {message.images && message.images.length > 0 && (
                        <div className="flex gap-2 mb-2">
                          {message.images.map((img) => (
                            <img key={img.id} src={img.preview} alt="Uploaded" className="w-20 h-20 object-cover rounded-lg" />
                          ))}
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-lawn/10 rounded-xl flex items-center justify-center text-sm flex-shrink-0">🧑‍🌾</div>
                    <div className="bg-white border border-deep-brown/10 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-deep-brown/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-deep-brown/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-deep-brown/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatMessagesEndRef} />
              </div>
            </div>

            {/* Chat input */}
            <div className="bg-white border-t border-deep-brown/10">
              <div className="max-w-2xl mx-auto px-4 py-3">
                {chatPendingImages.length > 0 && (
                  <div className="flex gap-2 mb-3 pb-3 border-b border-deep-brown/10">
                    {chatPendingImages.map((img) => (
                      <div key={img.id} className="relative">
                        <img src={img.preview} alt="To upload" className="w-16 h-16 object-cover rounded-lg border border-deep-brown/10" />
                        <button type="button" onClick={() => removeInlineChatImage(img.id)} className="absolute -top-2 -right-2 w-5 h-5 bg-deep-brown text-white rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 items-end">
                  <input ref={chatInlineFileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple onChange={handleInlineChatImageUpload} className="hidden" />
                  <input ref={chatInlineCameraRef} type="file" accept="image/jpeg,image/png" capture="environment" onChange={handleInlineChatImageUpload} className="hidden" />
                  <div className="flex-1 flex items-end gap-2 px-3 py-2 bg-cream/50 border border-deep-brown/10 rounded-2xl focus-within:border-lawn">
                    <button type="button" onClick={() => chatInlineCameraRef.current?.click()} className="p-1.5 text-deep-brown/40 hover:text-lawn active:scale-95 transition-all rounded-lg hover:bg-lawn/10 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <textarea
                      ref={chatTextareaRef}
                      value={chatInputInline}
                      onChange={(e) => setChatInputInline(e.target.value)}
                      onKeyDown={handleInlineChatKeyDown}
                      placeholder="Ask Larry anything..."
                      rows={1}
                      className="flex-1 bg-transparent text-base resize-none focus:outline-none min-h-[24px] max-h-[120px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInlineChatSend()}
                    disabled={(!chatInputInline.trim() && chatPendingImages.length === 0) || isChatLoading}
                    className="p-3 bg-lawn text-white rounded-xl disabled:bg-deep-brown/10 disabled:text-deep-brown/30 active:scale-95 transition-all flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />

        {/* Bottom Nav Bar */}
        <div className="bg-white border-t border-deep-brown/10 pb-[env(safe-area-inset-bottom)]">
          <div className="flex">
            {[
              { id: "home" as MobileView, label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { id: "activity" as MobileView, label: "Activity", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { id: "plan" as MobileView, label: "Plan", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
              { id: "spreader" as MobileView, label: "Spreader", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
              { id: "chat" as MobileView, label: "Chat", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
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

      {/* Desktop Layout - Dashboard with 2-column grid */}
      <div className="hidden lg:block h-full overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* === Hero Header Row === */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-deep-brown/60">{getGreeting()}</p>
              <h1 className="font-display text-2xl font-bold text-deep-brown">
                {profile?.grassType ? `Your ${formatGrassType(profile.grassType)} Lawn` : "Your Lawn"}
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
            <div className="col-span-2 flex flex-col gap-6">
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
                  <p className="font-display font-bold text-deep-brown text-xl">All done — your lawn thanks you.</p>
                  <p className="text-deep-brown/60 mt-1">{nextTask.completedCount} tasks crushed this season</p>
                </div>
              ) : (
                <Link
                  href="/"
                  className="block bg-lawn rounded-2xl p-6 hover:bg-lawn/95 transition-colors shadow-lg shadow-lawn/10"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm font-medium">Let&apos;s get growing</p>
                      <p className="text-white font-bold text-xl">Build Your 90-Day Plan</p>
                    </div>
                  </div>
                </Link>
              )}

              {/* Profile Completion CTA - Desktop inline banner */}
              {isProfileIncomplete && !profileCtaDismissed && (
                <Link
                  href="/profile"
                  className="flex items-center gap-3 bg-gradient-to-r from-terracotta/8 to-ochre/8 rounded-2xl border border-terracotta/15 px-5 py-3.5 hover:border-terracotta/30 transition-all group relative"
                >
                  <div className="w-9 h-9 bg-terracotta/12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-terracotta/18 transition-colors">
                    <svg className="w-4.5 h-4.5 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-deep-brown text-sm">Finish your profile for better recommendations</p>
                    <p className="text-xs text-deep-brown/50 mt-0.5">A few more details and Larry can dial in his advice.</p>
                  </div>
                  <span className="flex-shrink-0 px-3.5 py-1.5 bg-terracotta hover:bg-terracotta/90 text-white text-xs font-semibold rounded-lg transition-colors">
                    Finish
                  </span>
                  {/* Dismiss */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDismissProfileCta();
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-deep-brown/10 rounded-full flex items-center justify-center text-deep-brown/40 hover:text-deep-brown/70 hover:border-deep-brown/30 shadow-sm transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
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
                        onMouseEnter={() => setShowLarryInfo(true)}
                        className="w-5 h-5 bg-deep-brown/10 rounded-full flex items-center justify-center text-xs font-bold text-deep-brown/50 hover:bg-deep-brown/20 hover:text-deep-brown/70 transition-colors"
                      >
                        ?
                      </button>
                    </div>
                    <p className="text-sm text-deep-brown/60">He knows his stuff. Promise.</p>
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
              <div className="grid grid-cols-2 gap-4 mt-auto">
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
            <div className="flex flex-col gap-4">
              {/* Account Completion Card (Guests Only) */}
              {showAccountCard && (
                <AccountCompletionCard
                  guestEmail={guestData?.email || ""}
                  zipCode={profile?.zipCode || guestData?.zipCode || ""}
                  grassType={profile?.grassType || guestData?.grassType || ""}
                  onCreateAccount={() => setShowCreateAccountModal(true)}
                  onDismiss={handleDismissAccountCard}
                />
              )}

              {/* Progress Card */}
              {nextTask && nextTask.totalTasks > 0 && (
                <div className="bg-white rounded-2xl border border-deep-brown/10 p-5">
                  <h3 className="font-display font-bold text-deep-brown">90-Day Progress</h3>
                  {(profile?.grassType || profile?.zipCode) && (
                    <p className="text-xs text-deep-brown/50 mt-0.5 mb-4">
                      {[formatGrassType(profile?.grassType), profile?.zipCode ? `Zone ${getHardinessZone(profile.zipCode).toUpperCase()}` : null].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {!(profile?.grassType || profile?.zipCode) && <div className="mb-4" />}

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
              <div className="bg-white rounded-2xl border border-deep-brown/10 p-5 mt-auto">
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
                    <p className="text-sm text-deep-brown/50">Nothing logged yet — no judgment.</p>
                    <button
                      type="button"
                      onClick={handleOpenActivityModal}
                      className="text-sm text-lawn font-medium mt-1 hover:text-lawn/80"
                    >
                      Log your first one
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
            <LawnPlan onTaskToggle={findNextTask} />
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
                Liking what you see?
              </h2>
              <p className="text-deep-brown/70 text-center mb-6">
                Sign up to save your plan, get nudges before each step, and keep everything in one place.
              </p>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                {[
                  { icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z", text: "Snap a photo, get instant diagnosis" },
                  { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", text: "Ask Larry anything about your lawn" },
                  { icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", text: "We'll nudge you before each step — so you don't have to remember" },
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
              Liking what you see?
            </h2>
            <p className="text-deep-brown/70 text-center text-lg mb-8">
              Sign up to save your plan, get nudges before each step, and keep everything in one place.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {[
                { icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z", text: "Snap a photo, get instant diagnosis" },
                { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", text: "Ask Larry anything about your lawn" },
                { icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", text: "We'll nudge you before each step — so you don't have to remember" },
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
      <CreateAccountModal
        isOpen={showCreateAccountModal}
        onClose={() => setShowCreateAccountModal(false)}
        onSuccess={handleAccountCreated}
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
              Larry&apos;s the neighbor who actually knows what he&apos;s talking about.
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
              Ask him anything. He won&apos;t judge. (We&apos;ve all killed grass before.)
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
