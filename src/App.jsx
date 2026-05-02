import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import TaskModal from './components/TaskModal';
import { Plus } from 'lucide-react';
import { db } from './firebase';
import { 
  collection, 
  onSnapshot, 
  setDoc, 
  doc, 
  addDoc, 
  query, 
  orderBy 
} from "firebase/firestore";
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks from Firebase
  useEffect(() => {
    const q = collection(db, "tasks");
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksArr = [];
      querySnapshot.forEach((doc) => {
        tasksArr.push({ ...doc.data(), id: doc.id });
      });
      setTasks(tasksArr);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveTask = async (savedTask) => {
    try {
      if (editingTask) {
        await setDoc(doc(db, "tasks", savedTask.id), savedTask);
        setEditingTask(null);
      } else {
        await addDoc(collection(db, "tasks"), savedTask);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const updateTasksInFirebase = async (newTasks) => {
    // Find modified tasks and update them in Firestore
    for (const task of newTasks) {
      const oldTask = tasks.find(t => t.id === task.id);
      if (!oldTask || JSON.stringify(oldTask) !== JSON.stringify(task)) {
        try {
          await setDoc(doc(db, "tasks", task.id), task);
        } catch (e) {
          console.error("Error updating task:", e);
        }
      }
    }
  };

  const handleTaskClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Recurring Tasks Logic
  useEffect(() => {
    const checkRecurrence = async () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const dayOfWeek = now.getDay();
      const dayOfMonth = now.getDate();

      for (const task of tasks) {
        if (task.status === 'done' && task.recurrence && task.recurrence !== 'none') {
          const lastSpawned = task.lastSpawnedDate || '';
          
          if (lastSpawned !== todayStr) {
            let shouldSpawn = false;
            if (task.recurrence === 'daily') shouldSpawn = true;
            else if (task.recurrence === 'weekly' && dayOfWeek === 5) shouldSpawn = true;
            else if (task.recurrence === 'monthly' && dayOfMonth === 15) shouldSpawn = true;

            if (shouldSpawn) {
              const newTask = {
                ...task,
                status: 'backlog',
                lastSpawnedDate: null,
                deadline: ''
              };
              delete newTask.id; // Let Firestore generate a new ID
              
              try {
                // Update original task to mark it as spawned today
                await setDoc(doc(db, "tasks", task.id), { ...task, lastSpawnedDate: todayStr });
                // Create the new task instance
                await addDoc(collection(db, "tasks"), newTask);
              } catch (e) {
                console.error("Error in recurrence trigger:", e);
              }
            }
          }
        }
      }
    };

    const timer = setTimeout(checkRecurrence, 3000);
    return () => clearTimeout(timer);
  }, [tasks]);

  return (
    <div className="app-container">
      <header className="app-header">
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
        <Board tasks={tasks} setTasks={updateTasksInFirebase} onTaskClick={handleTaskClick} />
      </main>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}

export default App;

