import React from 'react';

export default function TaskCard({ task }) {
  return (
    <div className="task-card glass-card">
      <div className="task-labels">
        {task.label && (
          <span 
            className="task-label" 
            style={{ backgroundColor: task.label.color }}
          >
            {task.label.name}
          </span>
        )}
      </div>
      <h3 className="task-title">{task.title}</h3>
      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}
    </div>
  );
}
