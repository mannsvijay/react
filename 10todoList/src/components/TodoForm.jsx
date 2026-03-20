import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodo }                 from '../context';

const CATEGORIES = [
  { id: 'personal', label: 'Personal' },
  { id: 'work',     label: 'Work'     },
  { id: 'health',   label: 'Health'   },
  { id: 'creative', label: 'Creative' },
];

const PRIORITIES = [
  { id: 'low',    label: 'Low'  },
  { id: 'medium', label: 'Med'  },
  { id: 'high',   label: 'High' },
];

const expandVariant = {
  hidden:  { height: 0, opacity: 0 },
  show:    { height: 'auto', opacity: 1, transition: { duration: 0.30, ease: [0.22, 1, 0.36, 1] } },
  exit:    { height: 0, opacity: 0,      transition: { duration: 0.20, ease: [0.65, 0, 0.35, 1] } },
};

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5"  y1="12" x2="19" y2="12"/>
  </svg>
);

/* ════════════════════════════════════════ */
export default function TodoForm() {
/* ════════════════════════════════════════ */

  const [text,       setText      ] = useState('');
  const [category,   setCategory  ] = useState('personal');
  const [priority,   setPriority  ] = useState('medium');
  const [dueDate,    setDueDate   ] = useState('');
  const [expanded,   setExpanded  ] = useState(false);

  const inputRef  = useRef(null);
  const { addTodo } = useTodo();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    addTodo({
      todo:      text.trim(),
      completed: false,
      category,
      priority,
      dueDate:   dueDate || null,
      subtasks:  [],
    });

    setText('');
    setDueDate('');
    setExpanded(false);
    inputRef.current?.focus();
  };

  const todayStr = new Date().toISOString().split('T')[0];

  /* ════ render ════ */
  return (
    <form className="todo-form glass" onSubmit={handleSubmit} noValidate>

      {/* Main row */}
      <div className="form-row">
        <input
          ref={inputRef}
          type="text"
          className="form-input"
          placeholder="what needs to get done today?"
          value={text}
          onChange={e => setText(e.target.value)}
          onFocus={() => setExpanded(true)}
          aria-label="New task"
          autoComplete="off"
        />

        <div className="form-divider" aria-hidden="true" />

        <motion.button
          type="submit"
          className="form-add-btn"
          disabled={!text.trim()}
          whileTap={{ scale: 0.90 }}
          aria-label="Add task"
        >
          <PlusIcon />
        </motion.button>
      </div>

      {/* Expandable options */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="form-options"
            variants={expandVariant}
            initial="hidden"
            animate="show"
            exit="exit"
          >

            {/* Category */}
            <div className="opt-group">
              <span className="opt-label">Category</span>
              <div className="opt-btns">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`opt-btn ${category === cat.id ? 'opt-active' : ''}`}
                    onClick={() => setCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="opt-group">
              <span className="opt-label">Priority</span>
              <div className="opt-btns">
                {PRIORITIES.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    className={`opt-btn pri-${p.id} ${priority === p.id ? 'opt-active' : ''}`}
                    onClick={() => setPriority(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Due date */}
            <div className="opt-group">
              <span className="opt-label">Due date</span>
              <input
                type="date"
                className="date-input"
                value={dueDate}
                min={todayStr}
                onChange={e => setDueDate(e.target.value)}
                aria-label="Due date"
              />
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </form>
  );
}