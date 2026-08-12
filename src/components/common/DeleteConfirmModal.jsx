import React from 'react';

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting, 
  title = "Delete post?", 
  message = "Are you sure you want to delete this post? This action cannot be undone.",
  confirmLabel = "Delete"
}) => {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-bottom sm:modal-middle" open>
      <div className="modal-box border border-error/20 shadow-2xl rounded-t-3xl sm:rounded-2xl">
        <h3 className="font-bold text-lg text-error">{title}</h3>
        <p className="py-4 text-base-content/70">
          {message}
        </p>
        <div className="modal-action">
          <button 
            className="btn btn-ghost rounded-xl" 
            onClick={onClose} 
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            className="btn bg-error/10 text-error hover:bg-error hover:text-white border-none rounded-xl px-6" 
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? <span className="loading loading-spinner loading-sm text-current"></span> : confirmLabel}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-black/40 backdrop-blur-[1px]">
        <button onClick={onClose} disabled={isDeleting}>close</button>
      </form>
    </dialog>
  );
};

export default DeleteConfirmModal;
