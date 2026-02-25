# 01 - Hello World

**Topic:** Basic React setup and JSX concepts

## Learning Objectives
- Set up a React project with Create React App or Vite
- Understand JSX syntax
- Render components to the DOM
- Work with basic component structure

## Topics Covered
- React project initialization
- JSX fundamentals
- React.StrictMode
- Basic component rendering

## Project Structure
```
src/
  ├── App.jsx
  ├── index.jsx
  └── index.css
public/
  └── index.html
package.json
```

## Getting Started

### Create React App Method
```bash
npx create-react-app hello-world
cd hello-world
npm start
```

### Vite Method (Faster)
```bash
npm create vite@latest hello-world -- --template react
cd hello-world
npm install
npm run dev
```

## Exercises

1. **Display Hello World**
   - Create a simple component that displays "Hello World"

2. **Use JSX**
   - Practice JSX syntax with variables, expressions, and attributes

3. **Add Styling**
   - Style the component using CSS or inline styles

4. **Multiple Elements**
   - Render multiple elements (remember JSX fragments)

## Key Concepts

- **JSX:** A syntax extension to JavaScript that allows you to write HTML-like code in JavaScript
- **Components:** Reusable pieces of UI
- **Fragments:** Can be used to wrap multiple elements without adding extra DOM nodes

## Resources
- [React JSX Documentation](https://react.dev/learn/writing-markup-with-jsx)
- [Create React App](https://create-react-app.dev)
- [Vite + React](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)

---
**Status:** Not Started
