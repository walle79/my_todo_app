import React, { useState } from 'react';
import { X } from 'lucide-react';

const PRESET_LABELS = [
  { name: 'Bitville', color: 'var(--label-bitville)' },
  { name: 'S5tech', color: 'var(--label-s5tech)' },
  { name: 'Aventra', color: 'var(--label-aventra)' },
  { name: 'Personal', color: 'var(--label-personal)' },
];

const STATUSES = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'pending', title: 'Pending' },
  { id: 'done', title: 'Done' }
];

export default function TaskModal({ task, onClose, onSave }) {
  const isEditing = !!task;
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'backlog');
  const [selectedLabel, setSelectedLabel] = useState(
    task?.label ? PRESET_LABELS.find(l => l.name === task.label.name) || PRESET_LABELS[0] : PRESET_LABELS[0]
  );
  const [deadline, setDeadline] = useState(task?.deadline || '');
  const [time, setTime] = useState(task?.time || '');
  const [recurrence, setRecurrence] = useState(task?.recurrence || 'none');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSave({
      id: isEditing ? task.id : crypto.randomUUID(),
      title,
      description,
      status,
      label: selectedLabel,
      deadline,
      time,
      recurrence,
      lastSpawnedDate: isEditing ? task.lastSpawnedDate : null
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
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
          
          <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Time Estimate</label>
              <input 
                type="text" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                placeholder="e.g. 2h, 30m"
              />
            </div>
          </div>
          
          <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label>Deadline</label>
              <input 
                type="date" 
                value={deadline} 
                onChange={(e) => setDeadline(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Recurrence</label>
              <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly (Every Friday)</option>
                <option value="monthly">Monthly (15th)</option>
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
                  style={{ backgroundColor: label.color }}
                  onClick={() => setSelectedLabel(label)}
                >
                  {label.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{isEditing ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
