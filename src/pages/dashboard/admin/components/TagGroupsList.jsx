import React from 'react';
import { Trash2, ArrowUp, ArrowDown, Power, Edit2 } from 'lucide-react';

const TagGroupsList = ({ groups = [], onToggleEnable, onDelete, onEdit, onMoveUp, onMoveDown, isMutating }) => {
  const list = Array.isArray(groups) ? groups : [];

  return (
    <div className="p-4 sm:p-6 bg-base-100 rounded-2xl">
      {list.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-dashed border-base-300 bg-base-200/20 p-10 text-center flex flex-col items-center justify-center">
          <span className="text-3xl mb-3 opacity-40">🏷️</span>
          <p className="text-sm font-semibold text-base-content">No hashtag groups yet.</p>
          <p className="text-xs text-base-content/60 mt-1">Add your first group to start rotating hashtags.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((item, index) => (
            <div
              key={item._id}
              className={`rounded-2xl border ${item.enabled ? 'border-base-200 bg-base-100 shadow-sm' : 'border-base-300 bg-base-200/50 opacity-75'} p-4 flex flex-col xl:flex-row xl:items-center gap-4 transition-all`}
            >
              {/* Left: order + name + tags */}
              <div className="flex-1 min-w-0 flex flex-col gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="badge badge-sm font-bold bg-base-200 text-base-content/70 border-base-300 px-2 py-3 rounded-md">
                    #{item.order || index + 1}
                  </span>
                  <p className="text-sm sm:text-base font-bold text-base-content truncate max-w-full">
                    {item.name}
                  </p>
                  <span className={`badge badge-sm font-semibold border-none px-2.5 py-3 rounded-md ${item.enabled ? 'bg-success/15 text-success' : 'bg-base-300/50 text-base-content/60'}`}>
                    {item.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.hashtags?.map((tag, i) => (
                    <span key={i} className="text-xs font-mono font-medium text-base-content/80 bg-base-200/50 px-2 py-1 rounded-md border border-base-200">
                      #{String(tag).replace(/^#+/, '')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: actions */}
              <div className="flex items-center flex-wrap gap-2 shrink-0 pt-2 border-t border-base-200 xl:border-none xl:pt-0">
                <div className="flex gap-1 mr-2 bg-base-200/50 rounded-xl p-1 border border-base-200">
                  <button
                    type="button"
                    aria-label="Move group up"
                    className="btn btn-xs btn-square bg-base-100 hover:bg-base-200 border-none text-base-content/70 disabled:opacity-30 disabled:bg-transparent"
                    onClick={() => onMoveUp(index)}
                    disabled={index === 0 || isMutating}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Move group down"
                    className="btn btn-xs btn-square bg-base-100 hover:bg-base-200 border-none text-base-content/70 disabled:opacity-30 disabled:bg-transparent"
                    onClick={() => onMoveDown(index)}
                    disabled={index === list.length - 1 || isMutating}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  className={`btn btn-sm rounded-xl border-none shadow-none font-semibold ${item.enabled ? 'bg-base-200 text-base-content hover:bg-base-300' : 'bg-success/10 text-success hover:bg-success hover:text-white'} `}
                  onClick={() => onToggleEnable(item)}
                  disabled={isMutating}
                >
                  <Power className="h-4 w-4" />
                  {item.enabled ? 'Disable' : 'Enable'}
                </button>

                <button 
                  type="button" 
                  className="btn btn-sm btn-square rounded-xl btn-ghost text-base-content/70 hover:bg-base-200 hover:text-base-content" 
                  onClick={() => onEdit(item)}
                  disabled={isMutating}
                >
                  <Edit2 className="h-4 w-4" />
                </button>

                <button 
                  type="button" 
                  className="btn btn-sm btn-square rounded-xl btn-ghost text-error hover:bg-error/10 hover:text-error" 
                  onClick={() => onDelete(item)}
                  disabled={isMutating}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagGroupsList;
