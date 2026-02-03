"use client";

import { useState, useEffect, useCallback } from "react";
import { LawnPhoto } from "@/types";

const DB_NAME = "lawnhq_db";
const STORE_NAME = "photos";
const DB_VERSION = 1;

// Compress image to reduce storage size
const compressImage = (
  dataUrl: string,
  maxWidth: number = 800,
  quality: number = 0.7
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = dataUrl;
  });
};

// Create thumbnail for faster loading
const createThumbnail = (dataUrl: string): Promise<string> => {
  return compressImage(dataUrl, 150, 0.6);
};

// IndexedDB helpers
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

const getAllPhotos = async (): Promise<LawnPhoto[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const photos = request.result as LawnPhoto[];
      // Sort by date descending (newest first)
      photos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      resolve(photos);
    };
  });
};

const savePhoto = async (photo: LawnPhoto): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(photo);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

const deletePhotoFromDB = async (id: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export function usePhotos() {
  const [photos, setPhotos] = useState<LawnPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const storedPhotos = await getAllPhotos();
        setPhotos(storedPhotos);
      } catch (error) {
        console.error("Failed to load photos:", error);
        setPhotos([]);
      }
      setLoading(false);
    };

    loadPhotos();
  }, []);

  const addPhoto = useCallback(
    async (photo: Omit<LawnPhoto, "id">) => {
      // Compress the image before storing
      const compressedUrl = await compressImage(photo.url);
      const thumbnail = await createThumbnail(photo.url);

      const newPhoto: LawnPhoto = {
        ...photo,
        url: compressedUrl,
        thumbnail,
        id: Date.now().toString(),
      };

      try {
        await savePhoto(newPhoto);
        setPhotos((prev) => [newPhoto, ...prev]);
      } catch (error) {
        console.error("Failed to save photo:", error);
      }

      return newPhoto;
    },
    []
  );

  const deletePhoto = useCallback(async (id: string) => {
    try {
      await deletePhotoFromDB(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete photo:", error);
    }
  }, []);

  const updatePhoto = useCallback(
    async (id: string, updates: Partial<LawnPhoto>) => {
      const photoToUpdate = photos.find((p) => p.id === id);
      if (!photoToUpdate) return;

      const updatedPhoto = { ...photoToUpdate, ...updates };

      try {
        await savePhoto(updatedPhoto);
        setPhotos((prev) =>
          prev.map((p) => (p.id === id ? updatedPhoto : p))
        );
      } catch (error) {
        console.error("Failed to update photo:", error);
      }
    },
    [photos]
  );

  return { photos, loading, addPhoto, deletePhoto, updatePhoto };
}
