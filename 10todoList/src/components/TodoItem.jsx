import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence }         from 'framer-motion';
import { useSortable }                     from '@dnd-kit/sortable';
import { CSS }                             from '@dnd-kit/utilities';
import { useTodo }                         from '../context';

/* ── Inline SVG icons (no unicode, no emoji dependency) ── */
const IconDrag = () => (
  <svg width="12" height="14" viewBox="0 0 10 16" fill="currentColor">
    <circle cx="3" cy="2"  r="1.5"/><circle cx="3" cy="8"  r="1.5"/><circle cx="3" cy="14" r="1.5"/>
    <circle cx="8" cy="2"  r="1.5"/><circle cx="8" cy="8"  r="1.5"/><circle cx="8" cy="14" r="1.5"/>
  </svg>
);

const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconSave = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const IconSubs = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8"  y1="6"  x2="21" y2="6"/>
    <line x1="8"  y1="12" x2="21" y2="12"/>
    <line x1="8"  y1="18" x2="21" y2="18"/>
    <circle cx="3" cy="6"  r="1.2" fill="currentColor" stroke="none"/>
    <circle cx="3" cy="12" r="1.2" fill="currentColor" stroke="none"/>
    <circle cx="3" cy="18" r="1.2" fill="currentColor" stroke="none"/>
  </svg>
);

const IconClose = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconCheck = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconPlus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

/* ── Category & priority style maps ── */
const CAT = {
  personal: { color: '#32E0C4', label: 'Personal' },
  work:     { color: '#0f8c91', label: 'Work'     },
  health:   { color: '#4dcfcc', label: 'Health'   },
  creative: { color: '#2bbfb8', label: 'Creative' },
};

const PRI = {
  high:   { color: '#32E0C4', label: 'High' },
  medium: { color: '#0f8c91', label: 'Med'  },
  low:    { color: 'rgba(238,238,238,0.30)', label: 'Low' },
};

/* ── Sub-panel animation ── */
const subPanel = {
  hidden:  { height: 0, opacity: 0 },
  show:    { height: 'auto', opacity: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:    { height: 0, opacity: 0,      transition: { duration: 0.18, ease: [0.65, 0, 0.35, 1] } },
};

const subRow = {
  hidden:  { opacity: 0, x: -8 },
  show:    { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 240, damping: 22 } },
  exit:    { opacity: 0, x: 10, transition: { duration: 0.12 } },
};


/* ════════════════════════════════════════ */
export default function TodoItem({ todo }) {
/* ════════════════════════════════════════ */

  const [editing,     setEditing    ] = useState(false);
  const [editText,    setEditText   ] = useState(todo.todo);
  const [showSubs,    setShowSubs   ] = useState(false);
  const [newSub,      setNewSub     ] = useState('');

  /*
   * FIX: tiltRef is on the INNER card div only.
   * setNodeRef / dndStyle are on the OUTER wrapper div only.
   * These two transform systems never touch the same element.
   */
  const tiltRef    = useRef(null);
  const rafRef     = useRef(null);

  const {
    updatedTodo, deleteTodo, toggleComplete,
    addSubtask, toggleSubtask, deleteSubtask,
  } = useTodo();

  /* ── DnD sortable ── */
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  /* DnD transform only on the outer wrapper — never on the card itself */
  const dndStyle = {
    transform:  CSS.Transform.toString(transform),
    transition,
    zIndex:     isDragging ? 999 : undefined,
    opacity:    isDragging ? 0.70 : 1,
  };

  /* ── 3D tilt (inner card only) ── */
  const onMouseMove = useCallback((e) => {
    if (editing || isDragging) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const el = tiltRef.current;
      if (!el) return;
      const r    = el.getBoundingClientRect();
      const xPct = (e.clientX - r.left) / r.width  - 0.5;
      const yPct = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-yPct * 8}deg) rotateY(${xPct * 8}deg) translateZ(4px)`;
    });
  }, [editing, isDragging]);

  const onMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const el = tiltRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.50s cubic-bezier(0.34, 1.56, 0.64, 1)';
    el.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    setTimeout(() => { if (el) el.style.transition = ''; }, 540);
  }, []);

  /* ── Edit ── */
  const saveEdit = () => {
    if (!editText.trim()) return;
    updatedTodo(todo.id, { ...todo, todo: editText.trim() });
    setEditing(false);
  };

  /* ── Add subtask ── */
  const handleAddSub = (e) => {
    e.preventDefault();
    if (!newSub.trim()) return;
    addSubtask(todo.id, newSub.trim());
    setNewSub('');
  };

  /* ── Derived ── */
  const catStyle   = CAT[todo.category] || CAT.personal;
  const priStyle   = PRI[todo.priority] || PRI.medium;
  const subtasks   = todo.subtasks || [];
  const doneSubs   = subtasks.filter(s => s.completed).length;

  const todayStr   = new Date().toDateString();
  const dueD       = todo.dueDate ? new Date(todo.dueDate + 'T00:00:00') : null;
  const isToday    = dueD && dueD.toDateString() === todayStr;
  const isOverdue  = dueD && dueD < new Date() && !todo.completed && !isToday;
  const dueFmt     = dueD
    ? dueD.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    : null;

  /* ════ render ════ */
  return (
    /* Outer wrapper: DnD ref + DnD transform only */
    <div ref={setNodeRef} style={dndStyle}>

      {/* Inner card: 3D tilt only */}
      <div
        ref={tiltRef}
        className={`todo-card glass${todo.completed ? ' card-done' : ''}`}
        style={{ '--pri-color': priStyle.color }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Priority bar */}
        <div className="pri-bar" aria-hidden="true" />

        {/* Main row */}
        <div className="card-row">

          {/* Drag handle */}
          <button
            className="drag-handle"
            {...attributes}
            {...listeners}
            tabIndex={-1}
            aria-label="Drag to reorder"
          >
            <IconDrag />
          </button>

          {/* Checkbox */}
          <button
            className={`card-check${todo.completed ? ' checked' : ''}`}
            onClick={() => toggleComplete(todo.id)}
            aria-label={todo.completed ? 'Mark as active' : 'Mark as done'}
          >
            <motion.div
              className="check-dot"
              animate={{ scale: todo.completed ? 1 : 0, opacity: todo.completed ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            />
          </button>

          {/* Content */}
          <div className="card-body">

            {/* Text / edit input */}
            <input
              type="text"
              className={`card-text${todo.completed ? ' text-done' : ''}${editing ? ' text-edit' : ''}`}
              value={editText}
              readOnly={!editing}
              onChange={e => setEditText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && editing) saveEdit(); }}
              aria-label="Task text"
            />

            {/* Meta */}
            <div className="card-meta">
              <span
                className="meta-cat"
                style={{
                  color:       catStyle.color,
                  borderColor: `${catStyle.color}44`,
                  background:  `${catStyle.color}12`,
                }}
              >
                {catStyle.label}
              </span>

              <span className="meta-pri" style={{ color: priStyle.color }}>
                {priStyle.label}
              </span>

              {dueFmt && (
                <span className={`meta-date${isOverdue ? ' due-overdue' : isToday ? ' due-today' : ''}`}>
                  <IconCalendar />
                  {dueFmt}{isToday && ' — today'}{isOverdue && ' — overdue'}
                </span>
              )}

              {subtasks.length > 0 && (
                <button
                  className="subtask-toggle-btn"
                  onClick={() => setShowSubs(p => !p)}
                  aria-expanded={showSubs}
                >
                  <IconSubs />
                  {doneSubs}/{subtasks.length}
                </button>
              )}
            </div>

          </div>

          {/* Actions */}
          <div className="card-actions" role="group" aria-label="Task actions">

            <motion.button
              type="button"
              className="action-btn"
              onClick={() => setShowSubs(p => !p)}
              whileTap={{ scale: 0.85 }}
              aria-label="Toggle subtasks"
              title="Subtasks"
            >
              <IconSubs />
            </motion.button>

            <motion.button
              type="button"
              className="action-btn"
              onClick={() => {
                if (todo.completed) return;
                if (editing) saveEdit(); else setEditing(true);
              }}
              disabled={todo.completed}
              whileTap={{ scale: 0.85 }}
              aria-label={editing ? 'Save' : 'Edit task'}
              title={editing ? 'Save' : 'Edit'}
            >
              {editing ? <IconSave /> : <IconEdit />}
            </motion.button>

            <motion.button
              type="button"
              className="action-btn del"
              onClick={() => deleteTodo(todo.id)}
              whileTap={{ scale: 0.85 }}
              aria-label="Delete task"
              title="Delete"
            >
              <IconTrash />
            </motion.button>

          </div>
        </div>

        {/* Subtasks panel */}
        <AnimatePresence>
          {showSubs && (
            <motion.div
              className="subtasks-wrap"
              variants={subPanel}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {/* List */}
              <div className="subtask-list">
                <AnimatePresence mode="popLayout">
                  {subtasks.map(sub => (
                    <motion.div
                      key={sub.id}
                      className={`subtask-row${sub.completed ? ' sub-done' : ''}`}
                      variants={subRow}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      layout
                    >
                      <button
                        type="button"
                        className={`sub-check${sub.completed ? ' checked' : ''}`}
                        onClick={() => toggleSubtask(todo.id, sub.id)}
                        aria-label={sub.completed ? 'Uncheck' : 'Check subtask'}
                      >
                        {sub.completed && (
                          <span className="sub-check-icon"><IconCheck /></span>
                        )}
                      </button>

                      <span className="sub-text">{sub.text}</span>

                      <button
                        type="button"
                        className="sub-del"
                        onClick={() => deleteSubtask(todo.id, sub.id)}
                        aria-label="Delete subtask"
                      >
                        <IconClose />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add subtask */}
              <form className="sub-add-form" onSubmit={handleAddSub}>
                <input
                  type="text"
                  className="sub-add-input"
                  placeholder="break it down..."
                  value={newSub}
                  onChange={e => setNewSub(e.target.value)}
                  aria-label="New subtask"
                />
                <button
                  type="submit"
                  className="sub-add-btn"
                  aria-label="Add subtask"
                >
                  <IconPlus />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}