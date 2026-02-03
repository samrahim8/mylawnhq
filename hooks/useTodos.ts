"use client";

import { useState, useEffect } from "react";
import { Todo } from "@/types";

const STORAGE_KEY = "lawnhq_todos";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTodos(JSON.parse(stored));
      } catch {
        setTodos([]);
      }
    }
    setLoading(false);
  }, []);

  const saveTodos = (newTodos: Todo[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
    setTodos(newTodos);
  };

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    saveTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    const updated = todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date().toISOString() : undefined,
          }
        : todo
    );
    saveTodos(updated);
  };

  const deleteTodo = (id: string) => {
    saveTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    saveTodos(todos.filter((todo) => !todo.completed));
  };

  return { todos, loading, addTodo, toggleTodo, deleteTodo, clearCompleted };
}
