"use client";

import { useState, useEffect } from "react";
import { Equipment } from "@/types";

const STORAGE_KEY = "lawnhq_equipment";

export function useEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  // Load equipment from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEquipment(JSON.parse(stored));
      } catch {
        setEquipment([]);
      }
    }
    setLoading(false);
  }, []);

  // Save equipment to localStorage
  const saveEquipment = (newEquipment: Equipment[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEquipment));
    setEquipment(newEquipment);
  };

  // Add new equipment
  const addEquipment = (
    item: Omit<Equipment, "id" | "createdAt" | "updatedAt">
  ): Equipment => {
    const now = new Date().toISOString();
    const newItem: Equipment = {
      ...item,
      id: `equip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    saveEquipment([...equipment, newItem]);
    return newItem;
  };

  // Update existing equipment
  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    const updated = equipment.map((item) =>
      item.id === id
        ? { ...item, ...updates, updatedAt: new Date().toISOString() }
        : item
    );
    saveEquipment(updated);
  };

  // Delete equipment
  const deleteEquipment = (id: string) => {
    saveEquipment(equipment.filter((item) => item.id !== id));
  };

  // Get equipment by ID
  const getEquipmentById = (id: string): Equipment | undefined => {
    return equipment.find((item) => item.id === id);
  };

  // Search equipment by brand or model
  const searchEquipment = (query: string): Equipment[] => {
    const lowerQuery = query.toLowerCase();
    return equipment.filter(
      (item) =>
        item.brand.toLowerCase().includes(lowerQuery) ||
        item.model.toLowerCase().includes(lowerQuery) ||
        item.type.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    equipment,
    loading,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    getEquipmentById,
    searchEquipment,
  };
}
