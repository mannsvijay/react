import React, { useState } from 'react';
import { useTodo } from '../context';
import { motion } from 'framer-motion';

function TodoItem({ todo }) {
    const [isTodoEditable, setIsTodoEditable] = useState(false);
    const [todoMsg, setTodoMsg] = useState(todo.todo);
    const { updatedTodo, deleteTodo, toggleComplete } = useTodo();

    const editTodo = () => {
        updatedTodo(todo.id, { ...todo, todo: todoMsg });
        setIsTodoEditable(false);
    }

    const toggleCompleted = () => toggleComplete(todo.id);

    // Variants for 3D mounting/unmounting
    const itemVariants = {
        hidden: { opacity: 0, y: 50, rotateX: -30, scale: 0.9 },
        visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 14 } },
        exit: { opacity: 0, x: -100, rotateX: 45, scale: 0.8, transition: { duration: 0.2 } }
    };

    return (
        <motion.div
            layout
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{ scale: 1.01, rotateX: 2, rotateY: -1, z: 20 }}
            className={`group relative flex flex-col sm:flex-row items-start sm:items-center border backdrop-blur-lg rounded-2xl px-5 py-4 gap-4 shadow-2xl transition-all duration-500 overflow-hidden ${
                todo.completed 
                ? "bg-[#212121]/40 border-[#EEEEEE]/5 text-[#EEEEEE]/50" 
                : "bg-[#EEEEEE]/5 border-[#EEEEEE]/10 text-[#EEEEEE]"
            }`}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* Liquid overlay for completion state */}
            {todo.completed && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0D7377]/10 to-transparent w-[200%] animate-[shimmer_3s_infinite] pointer-events-none"></div>
            )}

            {/* Custom Checkbox */}
            <div className="relative flex items-center justify-center shrink-0 w-6 h-6 z-10">
                <input
                    type="checkbox"
                    className="peer appearance-none w-6 h-6 border-2 border-[#0D7377] rounded-md cursor-pointer checked:bg-[#32E0C4] checked:border-[#32E0C4] transition-all duration-300"
                    checked={todo.completed}
                    onChange={toggleCompleted}
                />
                <svg className="absolute w-4 h-4 pointer-events-none opacity-0 peer-checked:opacity-100 text-[#212121] transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>

            {/* Content & Metadata */}
            <div className="flex-grow flex flex-col gap-1 w-full z-10">
                <input
                    type="text"
                    className={`bg-transparent outline-none w-full text-lg transition-all duration-300 font-medium ${
                        isTodoEditable ? "border-b border-[#32E0C4] text-[#32E0C4]" : "border-b border-transparent"
                    } ${todo.completed ? "line-through decoration-[#0D7377] decoration-2" : ""}`}
                    value={todoMsg}
                    onChange={(e) => setTodoMsg(e.target.value)}
                    readOnly={!isTodoEditable}
                    onKeyDown={(e) => { if(e.key === 'Enter') editTodo() }}
                />
                
                {/* Meta Tags (Priority & Category) */}
                <div className={`flex gap-2 text-xs font-semibold uppercase tracking-wider mt-1 ${todo.completed ? 'opacity-30' : 'opacity-70'}`}>
                    <span className={`px-2 py-0.5 rounded-md ${todo.priority === 'high' ? 'bg-[#0D7377] text-[#EEEEEE]' : 'bg-[#EEEEEE]/10'}`}>
                        {todo.priority || 'Medium'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md border border-[#EEEEEE]/20">
                        {todo.category || 'Task'}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 shrink-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(238,238,238,0.2)" }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-xl flex justify-center items-center bg-[#EEEEEE]/10 border border-[#EEEEEE]/10 disabled:opacity-30 backdrop-blur-md"
                    onClick={() => {
                        if (todo.completed) return;
                        if (isTodoEditable) editTodo();
                        else setIsTodoEditable((prev) => !prev);
                    }}
                    disabled={todo.completed}
                >
                    {isTodoEditable ? "💾" : "🖊️"}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(224, 50, 50, 0.2)", borderColor: "rgba(224, 50, 50, 0.5)" }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-xl flex justify-center items-center bg-[#EEEEEE]/10 border border-[#EEEEEE]/10 backdrop-blur-md transition-colors"
                    onClick={() => deleteTodo(todo.id)}
                >
                    <span className="text-[#EEEEEE]">✕</span>
                </motion.button>
            </div>
        </motion.div>
    );
}

export default TodoItem;