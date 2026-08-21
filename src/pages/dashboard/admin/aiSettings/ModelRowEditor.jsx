import React, { useState } from 'react';
import { Pencil, Trash2, ChevronUp, ChevronDown, Check, X } from 'lucide-react';

const ModelRowEditor = ({ model, priority, isLast, onMoveUp, onMoveDown, onRemove, onEdit, isPrimary, totalModels }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(model);
  const [error, setError] = useState(null);

  const canRemove = !(isPrimary && totalModels === 1);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      setError('Model name cannot be empty.');
      return;
    }
    const err = onEdit(trimmed);
    if (err) {
      setError(err);
      return;
    }
    setIsEditing(false);
    setError(null);
  };

  const handleCancel = () => {
    setEditValue(model);
    setIsEditing(false);
    setError(null);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 p-3 bg-base-200/50 rounded-lg border border-base-300">
        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold text-base-content/40 w-4 text-right select-none">
            {priority}
          </div>
          <input 
            type="text" 
            className={`input input-sm input-bordered flex-1 ${error ? 'input-error' : ''}`} 
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            autoFocus
          />
          <button className="btn btn-sm btn-ghost btn-square text-success" onClick={handleSave} title="Save">
            <Check className="w-4 h-4" />
          </button>
          <button className="btn btn-sm btn-ghost btn-square" onClick={handleCancel} title="Cancel">
            <X className="w-4 h-4" />
          </button>
        </div>
        {error && <p className="text-xs text-error ml-6">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 hover:bg-base-200/50 rounded-lg group transition-colors">
      <div className="text-xs font-semibold text-base-content/40 w-4 text-right select-none">
        {priority}
      </div>
      <div className="flex-1 font-mono text-sm text-base-content/90 truncate">
        {model}
      </div>
      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
        <button 
          className="btn btn-ghost btn-xs btn-square" 
          onClick={onMoveUp}
          disabled={priority === 1}
          title="Move Up"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button 
          className="btn btn-ghost btn-xs btn-square" 
          onClick={onMoveDown}
          disabled={isLast}
          title="Move Down"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
        <button 
          className="btn btn-ghost btn-xs btn-square" 
          onClick={() => setIsEditing(true)}
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button 
          className={`btn btn-ghost btn-xs btn-square ${!canRemove ? 'opacity-30 cursor-not-allowed' : 'text-error'}`} 
          onClick={canRemove ? onRemove : undefined}
          title={!canRemove ? 'Cannot remove the last model from a Primary Provider' : 'Remove'}
          disabled={!canRemove}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ModelRowEditor;
