"use client";

import { useState, useEffect } from "react";
import { CalendarActivity } from "@/types";

const STORAGE_KEY = "lawnhq_activities";

export function useCalendar() {
  const [activities, setActivities] = useState<CalendarActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setActivities(JSON.parse(stored));
      } catch {
        setActivities([]);
      }
    }
    setLoading(false);
  }, []);

  const saveActivities = (newActivities: CalendarActivity[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newActivities));
    setActivities(newActivities);
  };

  const addActivity = (activity: Omit<CalendarActivity, "id">) => {
    const newActivity: CalendarActivity = {
      ...activity,
      id: Date.now().toString(),
    };
    saveActivities([...activities, newActivity]);
  };

  const deleteActivity = (id: string) => {
    saveActivities(activities.filter((a) => a.id !== id));
  };

  const updateActivity = (id: string, updates: Partial<CalendarActivity>) => {
    const updated = activities.map((a) =>
      a.id === id ? { ...a, ...updates } : a
    );
    saveActivities(updated);
  };

  return { activities, loading, addActivity, deleteActivity, updateActivity };
}
