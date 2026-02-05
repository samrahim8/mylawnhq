"use client";

import { useState } from "react";
import { Todo } from "@/types";

interface TodoListProps {
  todos: Todo[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenModal?: () => void;
  compact?: boolean;
}

const quickSuggestions = [
  "Mow the lawn",
  "Apply fertilizer",
  "Water grass",
];

export default function TodoList({ todos, onAdd, onToggle, onDelete, onOpenModal, compact }: TodoListProps) {
  const [newTodo, setNewTodo] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      onAdd(newTodo.trim());
      setNewTodo("");
      setIsAdding(false);
    }
  };

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  const wrapperClass = compact
    ? "flex flex-col pt-3"
    : "bg-white rounded-lg border border-[#e5e5e5] shadow-sm p-3 sm:p-4 h-full flex flex-col overflow-hidden";

  return (
    <div className={wrapperClass}>
      {!compact && (
        <div className="flex items-center justify-between mb-1.5 sm:mb-2 flex-shrink-0">
          <div>
            <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-[#1a1a1a]">To-Do List</h3>
            <p className="text-[10px] sm:text-xs text-[#a3a3a3]">
              {activeTodos.length === 0 ? "No tasks" : `${activeTodos.length} task${activeTodos.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <button
            onClick={onOpenModal || (() => setIsAdding(true))}
            className="p-1.5 sm:p-2 bg-[#7a8b6e] hover:bg-[#6a7b5e] rounded-lg text-white transition-colors"
          >
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      )}

      {/* Add new todo form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-1.5 sm:mb-2 flex-shrink-0">
          <div className="flex gap-1">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a task..."
              className="flex-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs bg-[#f8f6f3] border border-[#e5e5e5] rounded-lg text-[#1a1a1a] placeholder-[#a3a3a3] outline-none focus:border-[#7a8b6e]"
              autoFocus
            />
            <button
              type="submit"
              className="px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs bg-[#7a8b6e] hover:bg-[#6a7b5e] rounded-lg text-white transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {/* Todo list */}
      {todos.length === 0 ? (
        <div className="text-center flex-1 flex flex-col items-center justify-center">
          <p className="text-sm sm:text-base text-[#a3a3a3] mb-3">No tasks yet</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {quickSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onAdd(suggestion)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#f8f6f3] hover:bg-[#e5e5e5] rounded-full text-[#525252] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto min-h-0 space-y-1 scrollbar-hide">
          {/* Active todos */}
          {activeTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-[#f8f6f3] rounded-lg group"
            >
              <button
                onClick={() => onToggle(todo.id)}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 border-[#a3a3a3] hover:border-[#7a8b6e] flex items-center justify-center transition-colors flex-shrink-0"
              />
              <span className="flex-1 text-[11px] sm:text-xs text-[#1a1a1a] truncate">{todo.text}</span>
              <button
                onClick={() => onDelete(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[#e5e5e5] rounded transition-all flex-shrink-0"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#a3a3a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          {/* Completed todos */}
          {completedTodos.length > 0 && (
            <div className="pt-1 border-t border-[#e5e5e5] mt-1.5 sm:mt-2">
              <p className="text-[10px] sm:text-[11px] text-[#525252] mb-1">Completed</p>
              {completedTodos.slice(0, 2).map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-[#f8f6f3] rounded-lg group opacity-60"
                >
                  <button
                    onClick={() => onToggle(todo.id)}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 border-[#7a8b6e] bg-[#7a8b6e] flex items-center justify-center flex-shrink-0"
                  >
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="flex-1 text-[11px] sm:text-xs text-[#525252] line-through truncate">{todo.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
