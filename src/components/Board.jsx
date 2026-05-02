import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: 'var(--status-backlog)' },
  { id: 'in_progress', title: 'In Progress', color: 'var(--status-inprogress)' },
  { id: 'pending', title: 'Pending', color: 'var(--status-pending)' },
  { id: 'done', title: 'Done', color: 'var(--status-done)' }
];

export default function Board({ tasks, setTasks, onTaskClick }) {
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const draggedTask = tasks.find(t => t.id === draggableId);
    let newTasks = Array.from(tasks).filter(t => t.id !== draggableId);
    
    // Update status to the new column
    const updatedTask = { ...draggedTask, status: destination.droppableId };
    
    // Insert into destination at correct index
    const destTasks = newTasks.filter(t => t.status === destination.droppableId);
    destTasks.splice(destination.index, 0, updatedTask);
    
    // Combine back
    const otherTasks = newTasks.filter(t => t.status !== destination.droppableId);
    setTasks([...otherTasks, ...destTasks]);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board-grid">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter(t => t.status === column.id);
          
          return (
            <div key={column.id} className="board-column">
              <div className="column-header">
                <h2>{column.title}</h2>
                <span className="task-count">{columnTasks.length}</span>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                    className={`droppable-area ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                            className={snapshot.isDragging ? 'dragging-card' : ''}
                          >
                            <TaskCard task={task} onClick={() => onTaskClick(task)} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
