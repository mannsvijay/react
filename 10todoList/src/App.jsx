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

const CATEGORIES = ['all', 'personal', 'work', 'health', 'creative'];
const STATUSES   = ['all', 'active', 'done'];

/* ── Framer variants ── */
const wrapVariants = {
  hidden:  {},
  show:    { transition: { staggerChildren: 0.07 } },
};

const slideUp = {
  hidden:  { opacity: 0, y: 20 },
  show:    { opacity: 1, y: 0, transition: { duration: 0.50, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Format today's date ── */
const formatDate = () =>
  new Date().toLocaleDateString('en-GB', {
    weekday: 'short', day: '2-digit', month: 'short',
  }).toUpperCase();


/* ════════════════════════════════════════ */
export default function App() {
/* ════════════════════════════════════════ */

  const [todos,     setTodos    ] = useState([]);
  const [search,    setSearch   ] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [status,    setStatus   ] = useState('all');

  /* ── DnD sensors ── */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  /* ── CRUD ── */
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

  /* ── Subtasks ── */
  const addSubtask = useCallback((todoId, text) => {
    setTodos(prev => prev.map(t =>
      t.id === todoId
        ? { ...t, subtasks: [...(t.subtasks || []), { id: Date.now(), text, completed: false }] }
        : t,
    ));
  }, []);

  const toggleSubtask = useCallback((todoId, subId) => {
    setTodos(prev => prev.map(t =>
      t.id === todoId
        ? { ...t, subtasks: t.subtasks.map(s => s.id === subId ? { ...s, completed: !s.completed } : s) }
        : t,
    ));
  }, []);

  const deleteSubtask = useCallback((todoId, subId) => {
    setTodos(prev => prev.map(t =>
      t.id === todoId
        ? { ...t, subtasks: t.subtasks.filter(s => s.id !== subId) }
        : t,
    ));
  }, []);

  /* ── Drag-and-drop reorder ── */
  const handleDragEnd = useCallback(({ active, over }) => {
    if (!over || active.id === over.id) return;
    setTodos(prev => {
      const from = prev.findIndex(t => t.id === active.id);
      const to   = prev.findIndex(t => t.id === over.id);
      return arrayMove(prev, from, to);
    });
  }, []);

  /* ── Persistence ── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rawlist-todos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) setTodos(parsed);
      }
    } catch { /* corrupted storage — ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem('rawlist-todos', JSON.stringify(todos));
  }, [todos]);

  /* ── Filtered list ── */
  const visible = useMemo(() => {
    const q = search.toLowerCase().trim();
    return todos.filter(t => {
      const matchQ   = !q || t.todo.toLowerCase().includes(q);
      const matchCat = catFilter === 'all' || t.category === catFilter;
      const matchSt  = status === 'all'  ? true
                     : status === 'done' ? t.completed
                     :                     !t.completed;
      return matchQ && matchCat && matchSt;
    });
  }, [todos, search, catFilter, status]);

  /* ── Stats ── */
  const doneCount = useMemo(() => todos.filter(t => t.completed).length, [todos]);
  const pct       = todos.length > 0 ? Math.round((doneCount / todos.length) * 100) : 0;

  /* ════ render ════ */
  return (
    <TodoProvider value={{ todos, addTodo, updatedTodo, deleteTodo, toggleComplete, addSubtask, toggleSubtask, deleteSubtask }}>
      <div className="app-root">

        {/* Ambient layers */}
        <div className="bg-glow" aria-hidden="true" />
        <div className="bg-dots" aria-hidden="true" />

        <div className="app-wrap">
          <motion.div variants={wrapVariants} initial="hidden" animate="show">

            {/* ── Header ── */}
            <motion.header className="app-header" variants={slideUp}>
              <div className="header-left">
                <span className="header-date">{formatDate()}</span>
                <h1 className="header-title">rawlist.</h1>
              </div>

              <div className="header-right">
                <div className="progress-wrap">
                  <span className="progress-label">{doneCount} of {todos.length} done</span>
                  <div className="progress-track">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.60, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <span className="progress-pct">{pct}%</span>
                </div>

                <div className="streak-pill">
                  tasks today&nbsp;<span>{todos.filter(t => {
                    const d = new Date(t.createdAt);
                    return d.toDateString() === new Date().toDateString();
                  }).length}</span>
                </div>
              </div>
            </motion.header>

            {/* ── Form ── */}
            <motion.div variants={slideUp}>
              <TodoForm />
            </motion.div>

            {/* ── Search + Filters ── */}
            <motion.div className="filter-section" variants={slideUp}>

              {/* Search */}
              <div className="search-bar">
                <span className="search-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="search your tasks..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  aria-label="Search tasks"
                />
                <AnimatePresence>
                  {search && (
                    <motion.button
                      className="search-clear"
                      onClick={() => setSearch('')}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.12 }}
                      aria-label="Clear search"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Category chips */}
              <div className="cat-chips">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    className={`cat-chip ${catFilter === c ? 'active' : ''}`}
                    onClick={() => setCatFilter(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Status pills */}
              <div className="status-pills">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    className={`status-pill ${status === s ? 'active' : ''}`}
                    onClick={() => setStatus(s)}
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
                items={visible.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="todos-list">
                  <AnimatePresence mode="popLayout">

                    {visible.length === 0 ? (
                      <motion.div
                        key="empty"
                        className="empty-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="empty-title">nothing here.</div>
                        <div className="empty-sub">add something and get moving</div>
                        <div className="empty-blink" aria-hidden="true" />
                      </motion.div>
                    ) : visible.map((todo, i) => (
                      <motion.div
                        key={todo.id}
                        layout
                        initial={{ opacity: 0, x: -16, scale: 0.97 }}
                        animate={{ opacity: 1, x: 0,   scale: 1    }}
                        exit={{    opacity: 0, x:  20, scale: 0.95  }}
                        transition={{
                          layout:  { type: 'spring', stiffness: 300, damping: 30 },
                          opacity: { duration: 0.16 },
                          x:       { type: 'spring', stiffness: 200, damping: 20 },
                          delay:   i * 0.03,
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