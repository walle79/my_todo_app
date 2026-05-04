import React from 'react';
import { CheckSquare, Calendar, Clock, RotateCcw, Check } from 'lucide-react';

export default function TaskCard({ task, onClick, onDelete }) {
  const handleClear = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-card-header">
        <div className="task-title">{task.title}</div>
        {task.status === 'done' && (
          <button 
            className="task-clear-btn" 
            onClick={handleClear}
            title="Clear task"
          >
            <Check size={14} />
          </button>
        )}
      </div>
      
      <div className="task-meta-top">
        {task.label && (
          <span 
            className="task-label" 
            style={{ backgroundColor: task.label.color, color: 'white' }}
          >
            {task.label.name}
          </span>
        )}
        
        {task.recurrence && task.recurrence !== 'none' && (
          <div className="task-recurrence-icon" title={`Repeats ${task.recurrence}`}>
            <RotateCcw size={12} color="var(--text-secondary)" />
          </div>
        )}
      </div>

      <div className="task-details">
        {task.deadline && (
          <div className="task-detail-item" title="Deadline">
            <Calendar size={12} />
            <span>{task.deadline}</span>
          </div>
        )}
        {task.time && (
          <div className="task-detail-item" title="Time Estimate">
            <Clock size={12} />
            <span>{task.time}</span>
          </div>
        )}
      </div>
    </div>
  );
}
