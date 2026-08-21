import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ModelRowEditor from './ModelRowEditor';

const ProviderModelsCard = ({ providerName, models, isPrimary, onChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [addValue, setAddValue] = useState('');
  const [addError, setAddError] = useState(null);

  const handleEdit = (index, newModelName) => {
    const isDuplicate = models.some((m, i) => i !== index && m.trim() === newModelName);
    if (isDuplicate) return 'Duplicate model name.';
    
    const newModels = [...models];
    newModels[index] = newModelName;
    onChange(newModels);
    return null;
  };

  const handleRemove = (index) => {
    const newModels = [...models];
    newModels.splice(index, 1);
    onChange(newModels);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newModels = [...models];
    const temp = newModels[index];
    newModels[index] = newModels[index - 1];
    newModels[index - 1] = temp;
    onChange(newModels);
  };

  const handleMoveDown = (index) => {
    if (index === models.length - 1) return;
    const newModels = [...models];
    const temp = newModels[index];
    newModels[index] = newModels[index + 1];
    newModels[index + 1] = temp;
    onChange(newModels);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const trimmed = addValue.trim();
    if (!trimmed) {
      setAddError('Model name cannot be empty.');
      return;
    }
    if (models.some(m => m.trim() === trimmed)) {
      setAddError('Duplicate model name.');
      return;
    }
    
    onChange([...models, trimmed]);
    setAddValue('');
    setIsAdding(false);
    setAddError(null);
  };

  const cancelAdd = () => {
    setAddValue('');
    setIsAdding(false);
    setAddError(null);
  };

  const displayProviderName = providerName.charAt(0).toUpperCase() + providerName.slice(1);

  return (
    <div className="rounded-2xl border border-base-200 bg-base-100 overflow-hidden flex flex-col">
      <div className="bg-base-200/40 p-4 border-b border-base-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base-content">{displayProviderName}</h3>
          <p className="text-xs text-base-content/60 mt-0.5">
            {isPrimary ? 'Models are tried in this order.' : 'Models tried if primary fails.'}
          </p>
        </div>
        <div className={`badge badge-sm font-medium ${isPrimary ? 'badge-primary' : 'badge-ghost'}`}>
          {isPrimary ? 'Primary' : 'Fallback'}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        {models.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-base-content/60 italic">No {displayProviderName} models added yet.</p>
            <p className="text-xs text-base-content/40 mt-1">Add a model to make {displayProviderName} available for this task.</p>
          </div>
        ) : (
          <div className="space-y-1 mb-4">
            {models.map((m, i) => (
              <ModelRowEditor 
                key={i} // Using index is okay here because array swaps are full array replacements, but value might be better if unique. Index is safer if duplicates were accidentally introduced.
                model={m}
                priority={i + 1}
                isLast={i === models.length - 1}
                onMoveUp={() => handleMoveUp(i)}
                onMoveDown={() => handleMoveDown(i)}
                onRemove={() => handleRemove(i)}
                onEdit={(val) => handleEdit(i, val)}
                isPrimary={isPrimary}
                totalModels={models.length}
              />
            ))}
          </div>
        )}

        {isAdding ? (
          <form onSubmit={handleAddSubmit} className="mt-auto p-3 bg-base-200/30 rounded-lg border border-base-200">
            <div className="text-xs font-semibold mb-2 text-base-content/70">Add {displayProviderName} Model</div>
            <input 
              type="text"
              className={`input input-sm input-bordered w-full mb-2 ${addError ? 'input-error' : ''}`}
              placeholder="Enter model ID..."
              value={addValue}
              onChange={e => setAddValue(e.target.value)}
              autoFocus
            />
            {addError && <p className="text-xs text-error mb-2">{addError}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-xs btn-ghost" onClick={cancelAdd}>Cancel</button>
              <button type="submit" className="btn btn-xs btn-primary">Add Model</button>
            </div>
          </form>
        ) : (
          <button 
            className="btn btn-sm btn-outline btn-block mt-auto text-base-content/70 border-base-300 hover:border-base-content/30 hover:bg-base-200/50"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4 mr-1" /> Add {displayProviderName} Model
          </button>
        )}
      </div>
    </div>
  );
};

export default ProviderModelsCard;
