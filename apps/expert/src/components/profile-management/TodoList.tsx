import React, { useState } from "react";
import { ListTodo, Plus, CheckCircle2, Circle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Todo } from "./types";
import Button from "../ui/Button";

interface TodoListProps {
    todos: Todo[];
    onAdd: (text: string) => void;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    isActive?: boolean;
}

export default function TodoList({
    todos,
    onAdd,
    onToggle,
    onDelete,
    isActive
}: TodoListProps) {
    const [newTodo, setNewTodo] = useState("");
    const [isExpanded, setIsExpanded] = useState(true);

    const handleAdd = () => {
        if (newTodo.trim()) {
            onAdd(newTodo);
            setNewTodo("");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-400 overflow-hidden transition-all duration-300">
            <div 
                className={`flex items-center justify-between cursor-pointer transition-all duration-300 select-none ${
                    isActive 
                        ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white p-4 sm:p-6 shadow-md shadow-orange-500/10" 
                        : "hover:bg-gray-50/50 p-4 sm:p-6 text-gray-800"
                }`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="flex items-center text-base sm:text-lg font-bold">
                    <ListTodo className={`w-5 h-5 mr-2 ${isActive ? "text-white" : "text-orange-600"}`} /> My Todo List
                </h2>
                <div className="flex items-center space-x-3">
                    <span className={`text-xs sm:text-sm font-medium ${isActive ? "text-orange-50/90" : "text-gray-500"}`}>
                        {todos.filter((t) => !t.completed).length} pending
                    </span>
                    {isExpanded ? (
                        <ChevronUp className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                    ) : (
                        <ChevronDown className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="p-4 sm:p-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Add Todo Input */}
                    <div className="flex items-center gap-3 mb-5 mt-4">
                        <input
                            type="text"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleAdd()}
                            placeholder="Add a new task..."
                            className="flex-1 h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                        />
                        <button
                            onClick={handleAdd}
                            className="h-11 w-11 flex items-center justify-center shrink-0 rounded-xl shadow-md hover:shadow-lg transition-all bg-[#fd6410] text-white hover:bg-[#e55a0e] border-0 cursor-pointer"
                        >
                            <Plus size={24} strokeWidth={2.5} />
                        </button>
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
                                    <Button
                                        onClick={() => onToggle(todo.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="shrink-0 p-1 h-auto hover:bg-transparent"
                                    >
                                        {todo.completed ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-400 hover:text-orange-600" />
                                        )}
                                    </Button>
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
                                        className="shrink-0 text-red-500 hover:text-red-700 p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}


