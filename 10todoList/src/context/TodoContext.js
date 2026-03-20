import { createContext, useContext } from "react";

export const TodoContext = createContext({
  todos: [],
  addTodo:        (todo)               => {},
  updatedTodo:    (id, todo)           => {},
  deleteTodo:     (id)                 => {},
  toggleComplete: (id)                 => {},
  addSubtask:     (todoId, text)       => {},
  toggleSubtask:  (todoId, subtaskId)  => {},
  deleteSubtask:  (todoId, subtaskId)  => {},
});

export const useTodo = () => useContext(TodoContext);

export const TodoProvider = TodoContext.Provider;