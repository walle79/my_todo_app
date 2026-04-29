import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import TaskModal from './components/TaskModal';
import { Plus } from 'lucide-react';
import './App.css';

const initialTasks = [
  { id: 't1', title: 'UI Concept & Design', description: 'Design premium glassmorphism interfaces and dark mode themes.', status: 'done', label: { name: 'Design', color: 'var(--label-pink)' } },
  { id: 't2', title: 'Initialize Vite App', description: 'Bootstrap the React application using Vite for maximum performance.', status: 'done', label: { name: 'Setup', color: 'var(--label-green)' } },
  { id: 't3', title: 'Implement Drag and Drop', description: 'Integrate @hello-pangea/dnd for smooth drag and drop column capabilities.', status: 'in_progress', label: { name: 'Frontend', color: 'var(--label-blue)' } },
  { id: 't4', title: 'Task Modal Creation', description: 'Add ability to create and edit tasks with notes and labels.', status: 'pending', label: { name: 'Frontend', color: 'var(--label-blue)' } },
  { id: 't5', title: 'Quality Assurance Testing', description: 'Verify complete task management flow from creation to completion.', status: 'backlog', label: { name: 'QA', color: 'var(--label-orange)' } },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('todo_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="app-container">
      <header className="app-header glass">
        <div className="header-brand">
          <div className="logo-icon">✓</div>
          <h1>TaskFlow</h1>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </header>
      
      <main className="app-content">
        <Board tasks={tasks} setTasks={setTasks} />
      </main>

      {isModalOpen && (
        <TaskModal
          onClose={() => setIsModalOpen(false)}
          onSave={(newTask) => setTasks([...tasks, newTask])}
        />
      )}
    </div>
  );
}

export default App;
