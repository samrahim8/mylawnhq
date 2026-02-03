"use client";

import { useState, useEffect } from "react";
import { LawnProduct } from "@/types";

const STORAGE_KEY = "lawnhq_products";
const USER_PRODUCTS_KEY = "lawnhq_user_products";

// Legacy support: migrate old string products to new format
function migrateOldProducts(oldProducts: string[]): LawnProduct[] {
  return oldProducts.map((name, index) => ({
    id: `migrated-${index}-${Date.now()}`,
    name,
    brand: "Unknown",
    category: "other" as const,
    applicationRate: { lbsPer1000sqft: 0 },
    source: "user" as const,
    createdAt: new Date().toISOString(),
  }));
}

export function useProducts() {
  // Legacy string products (for backward compatibility with ActivityModal)
  const [products, setProducts] = useState<string[]>([]);
  // New structured user products
  const [userProducts, setUserProducts] = useState<LawnProduct[]>([]);

  useEffect(() => {
    // Load legacy products
    const storedLegacy = localStorage.getItem(STORAGE_KEY);
    if (storedLegacy) {
      try {
        setProducts(JSON.parse(storedLegacy));
      } catch {
        setProducts([]);
      }
    }

    // Load user products
    const storedUserProducts = localStorage.getItem(USER_PRODUCTS_KEY);
    if (storedUserProducts) {
      try {
        setUserProducts(JSON.parse(storedUserProducts));
      } catch {
        setUserProducts([]);
      }
    }
  }, []);

  // Legacy: Save string products
  const saveProducts = (newProducts: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  // Legacy: Add string product
  const addProduct = (product: string) => {
    const trimmed = product.trim();
    if (trimmed && !products.includes(trimmed)) {
      saveProducts([...products, trimmed]);
    }
  };

  // Legacy: Remove string product
  const removeProduct = (product: string) => {
    saveProducts(products.filter((p) => p !== product));
  };

  // New: Save user products
  const saveUserProducts = (newProducts: LawnProduct[]) => {
    localStorage.setItem(USER_PRODUCTS_KEY, JSON.stringify(newProducts));
    setUserProducts(newProducts);
  };

  // New: Add structured product
  const addUserProduct = (product: Omit<LawnProduct, "id" | "source" | "createdAt">) => {
    const newProduct: LawnProduct = {
      ...product,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source: "user",
      createdAt: new Date().toISOString(),
    };
    saveUserProducts([...userProducts, newProduct]);

    // Also add to legacy products for backward compatibility
    if (!products.includes(product.name)) {
      saveProducts([...products, product.name]);
    }

    return newProduct;
  };

  // New: Update user product
  const updateUserProduct = (id: string, updates: Partial<LawnProduct>) => {
    const updated = userProducts.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    saveUserProducts(updated);
  };

  // New: Remove user product
  const removeUserProduct = (id: string) => {
    const product = userProducts.find((p) => p.id === id);
    saveUserProducts(userProducts.filter((p) => p.id !== id));

    // Also remove from legacy products
    if (product) {
      saveProducts(products.filter((p) => p !== product.name));
    }
  };

  // New: Get user product by ID
  const getUserProductById = (id: string): LawnProduct | undefined => {
    return userProducts.find((p) => p.id === id);
  };

  // New: Search user products
  const searchUserProducts = (query: string): LawnProduct[] => {
    const lowerQuery = query.toLowerCase();
    return userProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery)
    );
  };

  // Migrate legacy products to structured format
  const migrateLegacyProducts = () => {
    if (products.length > 0 && userProducts.length === 0) {
      const migrated = migrateOldProducts(products);
      saveUserProducts(migrated);
      return migrated;
    }
    return userProducts;
  };

  return {
    // Legacy (backward compatibility)
    products,
    addProduct,
    removeProduct,

    // New structured products
    userProducts,
    addUserProduct,
    updateUserProduct,
    removeUserProduct,
    getUserProductById,
    searchUserProducts,
    migrateLegacyProducts,
  };
}
