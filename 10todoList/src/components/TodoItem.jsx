import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence }               from 'framer-motion';
import { useSortable }                           from '@dnd-kit/sortable';
import { CSS }                                   from '@dnd-kit/utilities';
import { useTodo }                               from '../context';

/* ─── Lookup tables ─── */
const CAT_STYLE = {
  personal: { color: '#32E0C4', label: 'Personal' },
  work:     { color: '#0D7377', label: 'Work'     },
  health:   { color: '#5CCFCC', label: 'Health'   },
  creative: { color: '#3ab8b4', label: 'Creative' },
};

const PRI_STYLE = {
  high:   { color: '#32E0C4', symbol: '▲', label: 'HIGH' },
  medium: { color: '#1aa8ad', symbol: '◆', label: 'MED'  },
  low: { color: '#1aa8ad', symbol: '◆', label: 'LOW'  },

};

/* ─── Subtask collapse variants ─── */
const subVariants = {
  hidden:  { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1, transition: { duration: 0.30, ease: [0.22, 1, 0.36, 1] } },
  exit:    { height: 0, opacity: 0, transition: { duration: 0.20, ease: [0.65, 0, 0.35, 1] } },
};

/* ─── Subtask row variants ─── */
const subItemVariants = {
  hidden:  { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
  exit:    { opacity: 0, x: 10, transition: { duration: 0.15 } },
};


/* ═══════════════════════════════════════════════════════ */
function TodoItem({ todo }) {
/* ═══════════════════════════════════════════════════════ */

  const [isTodoEditable,  setIsTodoEditable ] = useState(false);
  const [todoMsg,         setTodoMsg        ] = useState(todo.todo);
  const [showSubtasks,    setShowSubtasks   ] = useState(false);
  const [newSubtask,      setNewSubtask     ] = useState('');

  const cardRef      = useRef(null);
  const animFrameRef = useRef(null);

  const {
    updatedTodo,
    deleteTodo,
    toggleComplete,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
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

  const dndStyle = {
    transform:  CSS.Transform.toString(transform),
    transition,
    zIndex:     isDragging ? 999 : 'auto',
    opacity:    isDragging ? 0.72 : 1,
  };

  /* ── 3D tilt ── */
  const handleMouseMove = useCallback((e) => {
    if (isTodoEditable || isDragging) return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    animFrameRef.current = requestAnimationFrame(() => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const xRaw = (e.clientX - rect.left)  / rect.width  - 0.5;
      const yRaw = (e.clientY - rect.top)   / rect.height - 0.5;
      const x    =  xRaw * 9;
      const y    = -yRaw * 9;
      el.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateZ(5px)`;
    });
  }, [isTodoEditable, isDragging]);

  const handleMouseLeave = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)';
    el.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    setTimeout(() => { if (el) el.style.transition = ''; }, 600);
  }, []);

  /* ── Edit / save ── */
  const editTodo = () => {
    if (!todoMsg.trim()) return;
    updatedTodo(todo.id, { ...todo, todo: todoMsg }); /* BUG FIX: was id: todoMsg */
    setIsTodoEditable(false);
  };

  /* ── Subtask form ── */
  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    addSubtask(todo.id, newSubtask.trim());
    setNewSubtask('');
  };

  /* ── Derived values ── */
  const catStyle     = CAT_STYLE[todo.category] || CAT_STYLE.personal;
  const priStyle     = PRI_STYLE[todo.priority] || PRI_STYLE.medium;
  const subtasks     = todo.subtasks || [];
  const doneSubtasks = subtasks.filter(s => s.completed).length;

  const today   = new Date().toDateString();
  const isToday = todo.dueDate && new Date(todo.dueDate).toDateString() === today;
  const isOver  = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed && !isToday;

  const dueFmt = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    : null;

  /* ══════ render ══════ */
  return (
    <div ref={setNodeRef} style={dndStyle}>
      <div
        ref={cardRef}
        className={`todo-card glass-card${todo.completed ? ' todo-completed' : ''}${isDragging ? ' todo-dragging' : ''}`}
        style={{ '--priority-color': priStyle.color, '--cat-color': catStyle.color }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >

        {/* Priority accent bar */}
        <div className="priority-bar" aria-hidden="true" />

        {/* ── Main row ── */}
        <div className="todo-main">

          {/* Drag handle */}
          <button
            className="drag-handle"
            {...attributes}
            {...listeners}
            tabIndex={-1}
            aria-label="drag to reorder"
          >
            ⠿
          </button>

          {/* Checkbox */}
          <button
            className={`todo-check${todo.completed ? ' check-done' : ''}`}
            onClick={() => toggleComplete(todo.id)}
            aria-label={todo.completed ? 'mark incomplete' : 'mark complete'}
          >
            <motion.div
              className="check-inner"
              animate={{ scale: todo.completed ? 1 : 0, opacity: todo.completed ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20 }}
            />
          </button>

          {/* Content */}
          <div className="todo-content">

            {/* Text / edit input */}
            <input
              type="text"
              className={`todo-text${todo.completed ? ' text-done' : ''}${isTodoEditable ? ' text-editing' : ''}`}
              value={todoMsg}
              readOnly={!isTodoEditable}
              onChange={e => setTodoMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && isTodoEditable && editTodo()}
              aria-label="todo text"
            />

            {/* Meta chips */}
            <div className="todo-meta">
              <span
                className="meta-chip"
                style={{
                  color:       catStyle.color,
                  borderColor: `${catStyle.color}44`,
                  background:  `${catStyle.color}14`,
                }}
              >
                {catStyle.label}
              </span>

              <span className="meta-pri" style={{ color: priStyle.color }}>
                {priStyle.symbol} {priStyle.label}
              </span>

              {dueFmt && (
                <span className={`meta-date${isOver ? ' date-overdue' : isToday ? ' date-today' : ''}`}>
                  ⊙ {dueFmt}{isToday && ' · today'}{isOver && ' · overdue'}
                </span>
              )}

              {subtasks.length > 0 && (
                <button
                  className="meta-subtask-btn"
                  onClick={() => setShowSubtasks(p => !p)}
                  aria-expanded={showSubtasks}
                >
                  ◫ {doneSubtasks}/{subtasks.length}
                </button>
              )}
            </div>

          </div>

          {/* Action buttons */}
          <div className="todo-actions" role="group" aria-label="task actions">

            <motion.button
              type="button"
              className="action-btn"
              onClick={() => setShowSubtasks(p => !p)}
              whileTap={{ scale: 0.85 }}
              aria-label="toggle subtasks"
              title="Subtasks"
            >
              ◱
            </motion.button>

            <motion.button
              type="button"
              className="action-btn"
              onClick={() => {
                if (todo.completed) return;
                if (isTodoEditable) editTodo();
                else setIsTodoEditable(true);
              }}
              disabled={todo.completed}
              whileTap={{ scale: 0.85 }}
              aria-label={isTodoEditable ? 'save edit' : 'edit todo'}
              title={isTodoEditable ? 'Save' : 'Edit'}
            >
              {isTodoEditable ? '✓' : '✎'}
            </motion.button>

            <motion.button
              type="button"
              className="action-btn action-delete"
              onClick={() => deleteTodo(todo.id)}
              whileTap={{ scale: 0.85 }}
              aria-label="delete todo"
              title="Delete"
            >
              ×
            </motion.button>
          </div>

        </div>

        {/* ── Subtasks panel ── */}
        <AnimatePresence>
          {showSubtasks && (
            <motion.div
              className="subtasks-panel"
              variants={subVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >

              {/* Existing subtasks */}
              <div className="subtasks-list">
                <AnimatePresence mode="popLayout">
                  {subtasks.map(sub => (
                    <motion.div
                      key={sub.id}
                      className={`subtask-item${sub.completed ? ' subtask-done' : ''}`}
                      variants={subItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      <button
                        type="button"
                        className={`subtask-check${sub.completed ? ' sub-checked' : ''}`}
                        onClick={() => toggleSubtask(todo.id, sub.id)}
                        aria-label={sub.completed ? 'uncheck subtask' : 'check subtask'}
                      />
                      <span className="subtask-text">{sub.text}</span>
                      <button
                        type="button"
                        className="subtask-del"
                        onClick={() => deleteSubtask(todo.id, sub.id)}
                        aria-label="delete subtask"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add subtask form */}
              <form className="subtask-form" onSubmit={handleAddSubtask}>
                <input
                  type="text"
                  className="subtask-input"
                  placeholder="add subtask..."
                  value={newSubtask}
                  onChange={e => setNewSubtask(e.target.value)}
                  aria-label="new subtask"
                />
                <button
                  type="submit"
                  className="subtask-add-btn"
                  aria-label="add subtask"
                >
                  +
                </button>
              </form>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default TodoItem;