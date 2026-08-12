import React from 'react';
import { Trash2, ArrowUp, ArrowDown, Power } from 'lucide-react';

const TagGroupsList = ({ groups = [], onToggleEnable, onDelete, onMoveUp, onMoveDown }) => {
  const list = Array.isArray(groups) ? groups : [];

  return (
    <div className="mt-4 rounded-2xl border border-base-200 bg-base-100 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-base-content">Saved Hashtag Groups</p>
        <p className="text-xs text-muted">
          Total: <span className="font-semibold text-base-content/80">{list.length}</span>
        </p>
      </div>

      {list.length === 0 ? (
        <div className="mt-3 rounded-xl border border-base-200 bg-base-200/20 p-3 text-xs text-muted">
          No groups found for this account.
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {list.map((item, index) => (
            <div
              key={item._id}
              className={`rounded-xl border ${item.enabled ? 'border-base-200 bg-base-100' : 'border-base-300 bg-base-200/50 opacity-60'} p-3 flex items-center justify-between gap-3 transition-all`}
            >
              {/* Left: order + name + tags preview */}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-base-content flex items-center gap-2">
                  <span className="badge badge-sm badge-ghost">{index + 1}</span>
                  {item.name}
                  {!item.enabled && <span className="badge badge-sm badge-error badge-outline ml-2">Disabled</span>}
                </p>

                <p className="mt-2 text-xs text-muted font-mono break-all max-w-[60ch]">
                  {item.hashtags?.join(' ')}
                </p>
              </div>

              {/* Right: actions */}
              <div className="flex items-center gap-1 shrink-0">
                <div className="flex flex-col gap-1 mr-2">
                  <button
                    type="button"
                    className="btn btn-xs btn-square bg-base-100 border border-base-200"
                    onClick={() => onMoveUp(index)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-xs btn-square bg-base-100 border border-base-200"
                    onClick={() => onMoveDown(index)}
                    disabled={index === list.length - 1}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>

                <button
                  type="button"
                  className={`btn btn-xs sm:btn-sm rounded-xl border ${item.enabled ? 'btn-ghost' : 'btn-primary'} `}
                  onClick={() => onToggleEnable(item)}
                >
                  <Power className="h-4 w-4" />
                  {item.enabled ? 'Disable' : 'Enable'}
                </button>

                <button type="button" className="btn btn-xs sm:btn-sm rounded-xl btn-error btn-outline ml-1" onClick={() => onDelete(item)}>
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
