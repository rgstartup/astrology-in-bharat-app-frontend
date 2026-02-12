import React, { useState } from "react";
import { ListTodo, Plus, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { Todo } from "./types";
import { Button } from "../../../shared/components/Button";

interface TodoListProps {
    todos: Todo[];
    onAdd: (text: string) => void;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function TodoList({
    todos,
    onAdd,
    onToggle,
    onDelete,
}: TodoListProps) {
    const [newTodo, setNewTodo] = useState("");

    const handleAdd = () => {
        if (newTodo.trim()) {
            onAdd(newTodo);
            setNewTodo("");
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border-2 border-orange-400">
            <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center text-base sm:text-lg font-semibold">
                    <ListTodo className="w-5 h-5 mr-2 text-orange-600" /> My Todo List
                </h2>
                <span className="text-xs sm:text-sm text-gray-500">
                    {todos.filter((t) => !t.completed).length} pending
                </span>
            </div>

            {/* Add Todo Input */}
            <div className="flex space-x-2 mb-4">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAdd()}
                    placeholder="Add a new task..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Button
                    onClick={handleAdd}
                    variant="primary"
                    size="sm"
                    className="p-2"
                >
                    <Plus className="w-5 h-5" />
                </Button>
            </div>

            {/* Todo List */}
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar-yellow">
                {todos.length === 0 ? (
                    <p className="text-center text-gray-400 py-8 text-sm">
                        No tasks yet. Add one above!
                    </p>
                ) : (
                    todos.map((todo) => (
                        <div
                            key={todo.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${todo.completed
                                ? "bg-gray-50 border-gray-200"
                                : "bg-orange-50 border-orange-200"
                                }`}
                        >
                            <button
                                onClick={() => onToggle(todo.id)}
                                className="flex-shrink-0"
                            >
                                {todo.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                    <Circle className="w-5 h-5 text-gray-400 hover:text-orange-600" />
                                )}
                            </button>
                            <span
                                className={`flex-1 text-sm ${todo.completed
                                    ? "line-through text-gray-500"
                                    : "text-gray-800"
                                    }`}
                            >
                                {todo.text}
                            </span>
                            <Button
                                onClick={() => onDelete(todo.id)}
                                variant="ghost"
                                size="sm"
                                className="flex-shrink-0 text-red-500 hover:text-red-700 p-1"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
