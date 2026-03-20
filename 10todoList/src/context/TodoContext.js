import { createContext, useContext } from "react";

export const TodoContext = createContext({
  todos:          [],
  addTodo:        () => {},
  updatedTodo:    () => {},
  deleteTodo:     () => {},
  toggleComplete: () => {},
  addSubtask:     () => {},
  toggleSubtask:  () => {},
  deleteSubtask:  () => {},
});

export const useTodo     = () => useContext(TodoContext);
export const TodoProvider = TodoContext.Provider;