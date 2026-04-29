import React, { useState } from 'react';
import { X } from 'lucide-react';

const PRESET_LABELS = [
  { name: 'Frontend', color: 'var(--label-blue)' },
  { name: 'Backend', color: 'var(--label-green)' },
  { name: 'Design', color: 'var(--label-pink)' },
  { name: 'QA', color: 'var(--label-orange)' },
  { name: 'Bug', color: 'var(--label-red)' },
  { name: 'Feature', color: 'var(--label-purple)' },
];

const STATUSES = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'pending', title: 'Pending' },
  { id: 'done', title: 'Done' }
];

export default function TaskModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('backlog');
  const [selectedLabel, setSelectedLabel] = useState(PRESET_LABELS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSave({
      id: crypto.randomUUID(),
      title,
      description,
      status,
      label: selectedLabel
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card">
        <div className="modal-header">
          <h2>Create New Task</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Task Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="What needs to be done?"
              autoFocus
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description (Notes)</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Add details..."
              rows={3}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>
            
          <div className="form-group">
            <label>Project Label</label>
            <div className="label-selector">
              {PRESET_LABELS.map(label => (
                <button
                  key={label.name}
                  type="button"
                  className={`label-pill ${selectedLabel.name === label.name ? 'selected' : ''}`}
                  style={{ 
                    backgroundColor: label.color,
                    outline: selectedLabel.name === label.name ? '2px solid white' : 'none',
                    outlineOffset: '2px'
                  }}
                  onClick={() => setSelectedLabel(label)}
                >
                  {label.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}
