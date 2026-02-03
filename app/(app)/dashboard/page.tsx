"use client";

import { useState, useCallback, useRef } from "react";
import { CalendarActivity } from "@/types";
import Link from "next/link";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import WeeklyForecast from "@/components/dashboard/WeeklyForecast";
import SoilTemperature from "@/components/dashboard/SoilTemperature";
import Calendar from "@/components/dashboard/Calendar";
import RecentActivities from "@/components/dashboard/RecentActivities";
import TodoList from "@/components/dashboard/TodoList";
import QuickChat from "@/components/dashboard/QuickChat";
import ActivityModal from "@/components/dashboard/ActivityModal";
import TodoModal from "@/components/dashboard/TodoModal";
import PhotoCarousel from "@/components/dashboard/PhotoCarousel";
import LawnCareCalendarButton from "@/components/dashboard/LawnCareCalendarButton";
import MobileAccordion from "@/components/dashboard/MobileAccordion";
import { useProfile } from "@/hooks/useProfile";
import { useTodos } from "@/hooks/useTodos";
import { useCalendar } from "@/hooks/useCalendar";
import { useWeather } from "@/hooks/useWeather";
import { useProducts } from "@/hooks/useProducts";
import { usePhotos } from "@/hooks/usePhotos";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function DashboardPage() {
  const { profile, isSetUp } = useProfile();
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const { activities, addActivity, deleteActivity, updateActivity } = useCalendar();
  const { weather, loading: weatherLoading } = useWeather(profile?.zipCode);
  const { products, addProduct } = useProducts();
  const { photos, addPhoto, updatePhoto, deletePhoto } = usePhotos();
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const headerFileInputRef = useRef<HTMLInputElement>(null);
  const [editingActivity, setEditingActivity] = useState<CalendarActivity | null>(null);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);

  // Check if we're on mobile (below md breakpoint)
  const isMobile = useMediaQuery("(max-width: 767px)");

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

  const handleUpdateActivity = useCallback((activity: CalendarActivity) => {
    updateActivity(activity.id, activity);
  }, [updateActivity]);

  const handleHeaderPhotoUpload = useCallback(
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

      if (headerFileInputRef.current) {
        headerFileInputRef.current.value = "";
      }
    },
    [addPhoto]
  );

  // Mock soil temperature data
  const soilTemp = 68;
  const soilTrend = [65, 66, 67, 66, 68, 67, 68];

  // Accordion items for mobile view
  const accordionItems = [
    {
      id: "weather",
      title: weather ? `${Math.round(weather.current.temp)}°F` : "Weather",
      subtitle: weather ? weather.current.condition : "Set up profile to see weather",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      children: (
        <WeatherWidget weather={weather} loading={weatherLoading} compact />
      ),
    },
    {
      id: "calendar",
      title: "Calendar",
      subtitle: `${activities.length} activities logged`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      addButton: true,
      onAdd: handleOpenActivityModal,
      children: (
        <Calendar activities={activities} onOpenActivityModal={handleOpenActivityModal} compact />
      ),
    },
    {
      id: "activities",
      title: "Recent Activities",
      subtitle: activities.length > 0 ? `${activities.length} total` : "No activities yet",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      addButton: true,
      onAdd: handleOpenActivityModal,
      children: (
        <RecentActivities
          activities={activities}
          onDeleteActivity={deleteActivity}
          onOpenActivityModal={handleOpenActivityModal}
          onEditActivity={handleEditActivity}
          compact
        />
      ),
    },
    {
      id: "forecast",
      title: "This Week",
      subtitle: weather?.forecast?.[0] ? `High: ${weather.forecast[0].high}°F` : "Weather forecast",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      children: (
        <WeeklyForecast forecast={weather?.forecast || []} loading={weatherLoading} compact />
      ),
    },
    {
      id: "todos",
      title: "To-Do List",
      subtitle: todos.filter(t => !t.completed).length > 0
        ? `${todos.filter(t => !t.completed).length} tasks pending`
        : "No tasks",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      addButton: true,
      onAdd: () => setIsTodoModalOpen(true),
      children: (
        <TodoList
          todos={todos}
          onAdd={addTodo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onOpenModal={() => setIsTodoModalOpen(true)}
          compact
        />
      ),
    },
    {
      id: "soil",
      title: "Soil Temperature",
      subtitle: `${soilTemp}°F`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      children: (
        <SoilTemperature temperature={soilTemp} trend={soilTrend} compact />
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden p-2 sm:p-3 lg:p-4">
      {/* Header - Fixed height, responsive */}
      <div className="flex-shrink-0 bg-white rounded-lg border border-[#e5e5e5] shadow-sm p-3 sm:p-4 mb-2 sm:mb-3">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
          <div className="flex-shrink-0 text-center md:text-left">
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-[#1a1a1a]">
              Welcome to LawnHQ
            </h1>
            <p className="text-xs sm:text-sm text-[#525252]">Your AI-powered lawn care assistant.</p>
            {isSetUp ? (
              <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 mt-1 sm:mt-2">
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-[#7a8b6e]">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Profile set up for {profile?.zipCode}
                </span>
                <Link
                  href="/profile"
                  className="text-[11px] sm:text-xs text-[#a3a3a3] hover:text-[#525252]"
                >
                  Edit Profile
                </Link>
              </div>
            ) : (
              <div className="flex justify-center md:justify-start">
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-1.5 mt-1 sm:mt-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#7a8b6e] hover:bg-[#6a7b5e] text-white rounded-md text-[11px] sm:text-xs transition-colors"
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Set up your profile
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}

            {/* Shortcut Buttons */}
            <div className="flex flex-col items-center md:items-start gap-1.5 sm:gap-2 mt-2 sm:mt-3">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={handleOpenActivityModal}
                  className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-[#f5f5f5] hover:bg-[#e8ebe5] text-[#525252] hover:text-[#7a8b6e] rounded-md text-[11px] sm:text-xs font-medium transition-colors border border-[#e5e5e5]"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Activity
                </button>
                <button
                  type="button"
                  onClick={() => headerFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-[#f5f5f5] hover:bg-[#e8ebe5] text-[#525252] hover:text-[#7a8b6e] rounded-md text-[11px] sm:text-xs font-medium transition-colors border border-[#e5e5e5]"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Photos
                </button>
                <input
                  ref={headerFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleHeaderPhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => setIsTodoModalOpen(true)}
                  className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-[#f5f5f5] hover:bg-[#e8ebe5] text-[#525252] hover:text-[#7a8b6e] rounded-md text-[11px] sm:text-xs font-medium transition-colors border border-[#e5e5e5]"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  To Do List
                </button>
                <Link
                  href="/spreader"
                  className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-[#f5f5f5] hover:bg-[#e8ebe5] text-[#525252] hover:text-[#7a8b6e] rounded-md text-[11px] sm:text-xs font-medium transition-colors border border-[#e5e5e5]"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Spreader
                </Link>
              </div>
              <LawnCareCalendarButton
                calendarPreviewPath="/images/warm-season-calendar.png"
                calendarDownloadPath="/images/warm-season-calendar.pdf"
              />
            </div>
          </div>

          {/* Quick Chat in Header */}
          <div className="flex-1 lg:max-w-[550px] xl:max-w-[650px] 2xl:max-w-[750px] self-stretch flex">
            <div className="flex-1 flex">
              <QuickChat />
            </div>
          </div>
        </div>
      </div>

      {/* Photo Carousel - Fixed height, responsive */}
      <div className="flex-shrink-0 mb-2 sm:mb-3">
        <PhotoCarousel
          photos={photos}
          onAddPhoto={addPhoto}
          onUpdatePhoto={updatePhoto}
          onDeletePhoto={deletePhoto}
        />
      </div>

      {/* Dashboard Content - Mobile accordion or Desktop grid */}
      {isMobile ? (
        /* Mobile: Scrollable accordion */
        <div className="flex-1 overflow-y-auto min-h-0 pb-4">
          <MobileAccordion items={accordionItems} defaultExpandedId="weather" />
        </div>
      ) : (
        /* Tablet/Desktop: Grid layout */
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 auto-rows-fr">
          <WeatherWidget weather={weather} loading={weatherLoading} />
          <Calendar activities={activities} onOpenActivityModal={handleOpenActivityModal} />
          <RecentActivities
            activities={activities}
            onDeleteActivity={deleteActivity}
            onOpenActivityModal={handleOpenActivityModal}
            onEditActivity={handleEditActivity}
          />
          <WeeklyForecast forecast={weather?.forecast || []} loading={weatherLoading} />
          <TodoList
            todos={todos}
            onAdd={addTodo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onOpenModal={() => setIsTodoModalOpen(true)}
          />
          <SoilTemperature temperature={soilTemp} trend={soilTrend} />
        </div>
      )}

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
    </div>
  );
}
