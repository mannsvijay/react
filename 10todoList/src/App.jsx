import { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence, motion }                    from 'framer-motion';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

import './App.css';
import { TodoProvider } from './context';
import TodoForm          from './components/TodoForm';
import TodoItem          from './components/TodoItem';

/* ─── Filter constants ─── */
const CATEGORIES = ['all', 'personal', 'work', 'health', 'creative'];
const STATUSES   = ['all', 'pending', 'completed'];

/* ─── Animation variants ─── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const headerVariants = {
  hidden:  { opacity: 0, y: -28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const rowVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};


/* ═══════════════════════════════════════════════════════ */
function App() {
/* ═══════════════════════════════════════════════════════ */

  const [todos,          setTodos         ] = useState([]);
  const [search,         setSearch        ] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus,   setFilterStatus  ] = useState('all');
  const [isDark,         setIsDark        ] = useState(true);

  /* ─── DnD sensors ─── */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  /* ─── CRUD ─── */
  const addTodo = useCallback((todo) => {
    setTodos(prev => [
      { id: Date.now(), createdAt: Date.now(), subtasks: [], ...todo },
      ...prev,
    ]);
  }, []);

  const updatedTodo = useCallback((id, todo) => {
    setTodos(prev => prev.map(t => t.id === id ? todo : t));
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleComplete = useCallback((id) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    ));
  }, []);

  /* ─── Subtask handlers ─── */
  const addSubtask = useCallback((todoId, text) => {
    setTodos(prev => prev.map(t =>
      t.id === todoId
        ? { ...t, subtasks: [...(t.subtasks || []), { id: Date.now(), text, completed: false }] }
        : t,
    ));
  }, []);

  const toggleSubtask = useCallback((todoId, subtaskId) => {
    setTodos(prev => prev.map(t =>
      t.id === todoId
        ? { ...t, subtasks: t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s) }
        : t,
    ));
  }, []);

  const deleteSubtask = useCallback((todoId, subtaskId) => {
    setTodos(prev => prev.map(t =>
      t.id === todoId
        ? { ...t, subtasks: t.subtasks.filter(s => s.id !== subtaskId) }
        : t,
    ));
  }, []);

  /* ─── Drag-and-drop reorder ─── */
  const handleDragEnd = useCallback(({ active, over }) => {
    if (!over || active.id === over.id) return;
    setTodos(prev => {
      const from = prev.findIndex(t => t.id === active.id);
      const to   = prev.findIndex(t => t.id === over.id);
      return arrayMove(prev, from, to);
    });
  }, []);

  /* ─── Persistence ─── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('todos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setTodos(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  /* ─── Filtered list ─── */
  const filteredTodos = useMemo(() => {
    const q = search.toLowerCase().trim();
    return todos.filter(t => {
      const matchSearch   = !q || t.todo.toLowerCase().includes(q);
      const matchCategory = filterCategory === 'all' || t.category === filterCategory;
      const matchStatus   =
        filterStatus === 'all'       ? true  :
        filterStatus === 'completed' ? t.completed :
        /* pending */                  !t.completed;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [todos, search, filterCategory, filterStatus]);

  /* ─── Progress ─── */
  const completedCount = useMemo(() => todos.filter(t => t.completed).length, [todos]);
  const progress       = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  /* ═══════════════════ RENDER ═══════════════════ */
  return (
    <TodoProvider value={{ todos, addTodo, updatedTodo, deleteTodo, toggleComplete, addSubtask, toggleSubtask, deleteSubtask }}>
      <div className={`app-root ${isDark ? 'dark' : 'light'}`}>

        {/* ── Ambient layers ── */}
        <div className="bg-ambient" />
        <div className="bg-grid"    />

        <div className="app-container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >

            {/* ── Header ── */}
            <motion.header className="app-header" variants={headerVariants}>
              <div className="header-top">
                <div className="header-title">
                  <span className="header-eyebrow">// your</span>
                  <h1 className="header-main">bureau.</h1>
                </div>

                <div className="header-controls">
                  <motion.button
                    className="theme-toggle"
                    onClick={() => setIsDark(p => !p)}
                    aria-label="toggle theme"
                    whileTap={{ scale: 0.88 }}
                  >
                    {isDark ? '◐' : '◑'}
                  </motion.button>

                  <div className="progress-pill">
                    <span className="progress-num">{completedCount}/{todos.length}</span>
                    <div className="progress-track">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <span className="progress-pct">{progress}%</span>
                  </div>
                </div>
              </div>
            </motion.header>

            {/* ── Form ── */}
            <motion.div variants={rowVariants}>
              <TodoForm />
            </motion.div>

            {/* ── Search + Filter ── */}
            <motion.div className="filter-row" variants={rowVariants}>

              {/* Search */}
              <div className="search-wrap">
                <span className="search-icon">⌕</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="search tasks..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  aria-label="search todos"
                />
                <AnimatePresence>
                  {search && (
                    <motion.button
                      className="search-clear"
                      onClick={() => setSearch('')}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.15 }}
                      aria-label="clear search"
                    >
                      ×
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Category chips */}
              <div className="filter-chips">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`chip ${filterCategory === cat ? 'chip-active' : ''}`}
                    onClick={() => setFilterCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Status pills */}
              <div className="filter-pills">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    className={`pill ${filterStatus === s ? 'pill-active' : ''}`}
                    onClick={() => setFilterStatus(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* ── Todo list ── */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredTodos.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="todos-list">
                  <AnimatePresence mode="popLayout">
                    {filteredTodos.length === 0 ? (

                      <motion.div
                        className="empty-state"
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="empty-glyph">nothing yet.</div>
                        <div className="empty-sub">add something worth doing</div>
                        <div className="empty-dot" />
                      </motion.div>

                    ) : filteredTodos.map((todo, i) => (

                      <motion.div
                        key={todo.id}
                        layout
                        initial={{ opacity: 0, x: -20, scale: 0.97 }}
                        animate={{ opacity: 1, x: 0,   scale: 1    }}
                        exit={{    opacity: 0, x:  24, scale: 0.94  }}
                        transition={{
                          layout:  { type: 'spring', stiffness: 320, damping: 32 },
                          opacity: { duration: 0.18 },
                          x:       { type: 'spring', stiffness: 220, damping: 22 },
                          scale:   { duration: 0.2 },
                          delay:   i * 0.035,
                        }}
                      >
                        <TodoItem todo={todo} />
                      </motion.div>

                    ))}
                  </AnimatePresence>
                </div>
              </SortableContext>
            </DndContext>

          </motion.div>
        </div>

      </div>
    </TodoProvider>
  );
}

export default App;