import React from 'react';

const MediaPreviewModal = ({ 
  isOpen, 
  onClose, 
  previewUrl, 
  mimeType 
}) => {
  if (!isOpen || !previewUrl) return null;

  const isImage = mimeType?.startsWith('image/');
  const isVideo = mimeType?.startsWith('video/');

  return (
    <dialog className="modal modal-bottom sm:modal-middle" open>
      <div className="modal-box w-11/12 max-w-5xl bg-base-100 p-4 border border-base-200/50 shadow-2xl rounded-t-3xl sm:rounded-2xl">
        <form method="dialog">
          <button 
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </form>
        
        <div className="flex items-center justify-center w-full min-h-[300px] max-h-[80vh] bg-base-200/30 rounded-xl overflow-hidden mt-6">
          {isImage && (
            <img 
              src={previewUrl} 
              alt="Post media preview full size" 
              className="max-w-full max-h-[75vh] object-contain"
            />
          )}
          {isVideo && (
            <video 
              src={previewUrl} 
              controls 
              preload="metadata"
              className="max-w-full max-h-[75vh] object-contain"
            />
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-black/60 backdrop-blur-sm">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default MediaPreviewModal;
