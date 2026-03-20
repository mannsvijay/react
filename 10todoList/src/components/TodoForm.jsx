import React, { useState } from 'react';
import { useTodo } from '../context';
import { motion } from 'framer-motion';

function TodoForm() {
    const [todo, setTodo] = useState("");
    const { addTodo } = useTodo();

    const add = (e) => {
        e.preventDefault();
        if (!todo) return;
        
        addTodo({ todo, completed: false, priority: 'medium', category: 'Task' });
        setTodo("");
    }

    return (
        <motion.form 
            onSubmit={add} 
            className="flex relative group"
            initial={{ opacity: 0, scale: 0.95, rotateX: -10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            <input
                type="text"
                placeholder="What's your next move?"
                className="w-full bg-[#EEEEEE]/5 backdrop-blur-xl border border-[#EEEEEE]/10 rounded-2xl px-6 py-4 outline-none text-[#EEEEEE] placeholder:text-[#EEEEEE]/40 transition-all duration-300 focus:border-[#32E0C4]/50 focus:bg-[#EEEEEE]/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] font-semibold"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
            />
            <motion.button 
                type="submit" 
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(50, 224, 196, 0.4)" }}
                whileTap={{ scale: 0.95, y: 2 }}
                className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-gradient-to-r from-[#0D7377] to-[#32E0C4] text-[#212121] font-bold tracking-widest shrink-0 uppercase"
            >
                ADD
            </motion.button>
        </motion.form>
    );
}

export default TodoForm;