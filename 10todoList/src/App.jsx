import { useState, useEffect } from 'react';
import { TodoProvider } from './context';
import { TodoForm, TodoItem } from './components'; 
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [todos, setTodos] = useState([]);

  const addTodo = (todo) => {
    setTodos((prev) => [{ id: Date.now(), ...todo }, ...prev]);
  };

  const updatedTodo = (id, todo) => {
    setTodos((prev) => prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo)));
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos((prev) => prev.map((prevTodos) => prevTodos.id === id ? { ...prevTodos, completed: !prevTodos.completed } : prevTodos));
  };

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos"));
    if (todos && todos.length > 0) {
      setTodos(todos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <TodoProvider value={{ todos, addTodo, updatedTodo, deleteTodo, toggleComplete }}>
      {/* Ambient Background Glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#0D7377] rounded-full mix-blend-screen filter blur-[150px] opacity-30 pointer-events-none transition-all duration-1000"></div>
      
      <div className="min-h-screen py-12 px-4 relative z-10 selection:bg-[#32E0C4] selection:text-[#212121]">
        <div className="w-full max-w-3xl mx-auto">
          
          {/* Brush Font Header */}
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl text-center mb-12 text-[#EEEEEE] tracking-wide"
            style={{ fontFamily: "'Permanent Marker', cursive", textShadow: '4px 4px 0px rgba(13, 115, 119, 0.5)' }}
          >
            THE <span className="text-[#32E0C4]">HUSTLE</span> LIST
          </motion.h1>

          <div className="mb-10 perspective-1000">
            <TodoForm />
          </div>

          {/* 3D List Container */}
          <motion.div 
            layout
            className="flex flex-col gap-y-4 perspective-1000"
          >
            <AnimatePresence mode="popLayout">
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
              
              {todos.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 0.5, filter: 'blur(0px)' }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 text-[#EEEEEE] font-light italic"
                >
                  Silence is golden. Add a task to break it.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </TodoProvider>
  )
}

export default App;