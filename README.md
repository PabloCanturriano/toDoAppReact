# ToDo App React

A modern, Kanban-style task management application built with React, TypeScript, and Vite.

**Live Demo**: https://to-do-app-react-5b1z4zcuv-josecanturiano-gmailcoms-projects.vercel.app

## Features

- 📋 **Kanban Board**: Organize tasks into "To Do", "In Progress", and "Done" columns.
- 🖱️ **Drag & Drop**: Smooth drag and drop interface using `@dnd-kit`.
- 📝 **Task Management**: Create, edit, and delete tasks with ease.
- 🔍 **Search & Filter**: Quickly find tasks by title or status.
- 💾 **Local Persistence**: Data is saved locally using IndexedDB, so you never lose your work.
- 🎨 **Modern UI**: Clean and responsive design powered by Ant Design.
- 🧪 **Robust Testing**: Unit tests for core logic and components using Vitest.

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **UI Library**: [Ant Design](https://ant.design/)
- **Drag & Drop**: [dnd-kit](https://dndkit.com/)
- **State Management**: React Hooks + Context (if applicable) / Local State
- **Storage**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (via [idb](https://github.com/jakearchibald/idb))
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd todo-app-react
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build locally.
- `npm run test`: Runs the test suite using Vitest.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run lint:fix`: Runs ESLint and automatically fixes issues.
- `npm run type-check`: Runs the TypeScript compiler to check for type errors.
- `npm run check`: Runs both `type-check` and `lint` to ensure code quality.

## Project Structure

```
src/
├── components/     # React components (Board, Column, TaskModal, etc.)
├── hooks/          # Custom hooks (useTaskStore, etc.)
├── services/       # API and Database services
├── types.ts        # TypeScript type definitions
├── App.tsx         # Main application component
└── main.tsx        # Entry point
```
