import React from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';

const TagGroupsList = ({ tags = [], onUpdate, onDelete }) => {
  // tags expected: array of docs from backend
  // example item: { _id, account, tags, createdAt }
  const list = Array.isArray(tags) ? tags : [];

  return (
    <div className="mt-4 rounded-2xl border border-base-200 bg-base-100 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-secondary">Saved Tag Groups</p>
        <p className="text-xs text-muted">
          Total: <span className="font-semibold text-secondary/80">{list.length}</span>
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
              key={item?._id || index}
              className="rounded-xl border border-base-200 bg-base-100 p-3 flex items-center justify-between gap-3"
            >
              {/* Left: number + tags preview */}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-secondary">
                  {index + 1}.
                  <span className="ml-2 font-normal text-muted text-xs">{item?.createdAt ? String(item.createdAt).slice(0, 10) : ''}</span>
                </p>

                <p className="mt-1 text-xs text-muted truncate max-w-[60ch]">{item?.tags || '—'}</p>
              </div>

              {/* Right: actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  className="btn btn-xs sm:btn-sm rounded-xl bg-base-100 border border-base-200"
                  onClick={() => onUpdate?.(item)}
                >
                  <RefreshCw className="h-4 w-4" />
                  Update
                </button>

                <button type="button" className="btn btn-xs sm:btn-sm rounded-xl btn-error btn-outline" onClick={() => onDelete?.(item)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
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
