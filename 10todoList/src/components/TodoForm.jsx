import React, { useState, useRef } from 'react';
import { motion, AnimatePresence }  from 'framer-motion';
import { useTodo }                  from '../context';

/* ─── Config ─── */
const CATEGORIES = [
  { id: 'personal', label: 'Personal', icon: '◈' },
  { id: 'work',     label: 'Work',     icon: '◉' },
  { id: 'health',   label: 'Health',   icon: '◎' },
  { id: 'creative', label: 'Creative', icon: '◇' },
];

const PRIORITIES = [
  { id: 'low',    label: 'Low',  symbol: '▽' },
  { id: 'medium', label: 'Med',  symbol: '◆' },
  { id: 'high',   label: 'High', symbol: '△' },
];

const expandVariants = {
  hidden:  { height: 0, opacity: 0  },
  visible: { height: 'auto', opacity: 1, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit:    { height: 0, opacity: 0, transition: { duration: 0.22, ease: [0.65, 0, 0.35, 1] } },
};

/* ═══════════════════════════════════════════════════════ */
function TodoForm() {
/* ═══════════════════════════════════════════════════════ */

  const [todo,       setTodo      ] = useState('');
  const [category,   setCategory  ] = useState('personal');
  const [priority,   setPriority  ] = useState('medium');
  const [dueDate,    setDueDate   ] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const inputRef  = useRef(null);
  const { addTodo } = useTodo();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!todo.trim()) return;

    addTodo({
      todo:      todo.trim(),
      completed: false,
      category,
      priority,
      dueDate:   dueDate || null,
      subtasks:  [],
      tags:      [],
    });

    setTodo('');
    setDueDate('');
    setIsExpanded(false);
    inputRef.current?.focus();
  };

  const today = new Date().toISOString().split('T')[0];

  /* ══════ render ══════ */
  return (
    <form className="todo-form glass-card" onSubmit={handleSubmit} noValidate>

      {/* ── Main input row ── */}
      <div className="form-main-row">
        <input
          ref={inputRef}
          type="text"
          className="form-input"
          placeholder="what needs to be done..."
          value={todo}
          onChange={e => setTodo(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          aria-label="new todo"
        />

        <motion.button
          type="submit"
          className="form-add-btn"
          disabled={!todo.trim()}
          whileTap={{ scale: 0.9 }}
          aria-label="add todo"
        >
          +
        </motion.button>
      </div>

      {/* ── Expandable options ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="form-expanded"
            variants={expandVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="form-options-row">

              {/* Category */}
              <div className="form-option-group">
                <span className="form-option-label">category</span>
                <div className="category-select">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`cat-btn ${category === cat.id ? 'cat-active' : ''}`}
                      onClick={() => setCategory(cat.id)}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="form-option-group">
                <span className="form-option-label">priority</span>
                <div className="priority-select">
                  {PRIORITIES.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      className={`pri-btn pri-${p.id} ${priority === p.id ? 'pri-active' : ''}`}
                      onClick={() => setPriority(p.id)}
                    >
                      {p.symbol} {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due date */}
              <div className="form-option-group">
                <span className="form-option-label">due date</span>
                <input
                  type="date"
                  className="date-input"
                  value={dueDate}
                  min={today}
                  onChange={e => setDueDate(e.target.value)}
                  aria-label="due date"
                />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </form>
  );
}

export default TodoForm;