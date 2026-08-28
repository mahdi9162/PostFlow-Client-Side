import React, { useState, useEffect, useRef } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import MediaPreviewModal from './MediaPreviewModal';

const MediaPreview = ({ post, reviewNumber }) => {
  const axiosSecure = useAxiosSecure();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    if (!post?._id || !post?.media?.driveFileId) {
      setHasError(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasFetched) {
          setHasFetched(true);
          fetchPreview();
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [post?._id, post?.media?.driveFileId, hasFetched]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPreview = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await axiosSecure.get(`/api/posts/${post._id}/media/preview`, {
        responseType: 'blob'
      });
      
      const responseMimeType = response.headers['content-type'] || post.media?.mimeType || '';
      setMimeType(responseMimeType);
      
      const blob = new Blob([response.data], { type: responseMimeType });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!post?._id || !post?.media?.driveFileId) {
    return null; // Do not show anything if no media exists
  }

  const isImage = mimeType?.startsWith('image/');
  const isVideo = mimeType?.startsWith('video/');
  const isUnknown = previewUrl && !isImage && !isVideo;

  return (
    <div ref={containerRef} className="mb-5">
      {reviewNumber !== undefined && (
        <div className="mb-2">
          <span
            className="badge badge-neutral text-xs font-bold px-2 py-1 h-auto rounded-lg shadow-sm"
            aria-label={`Post ${reviewNumber}`}
          >
            #{reviewNumber}
          </span>
        </div>
      )}
      <div 
        className="relative w-full h-64 sm:h-80 rounded-2xl bg-base-200/50 ring-1 ring-base-200/60 overflow-hidden flex items-center justify-center"
      >
      {isLoading ? (
        <div className="w-full h-full animate-pulse bg-base-200/50"></div>
      ) : hasError || isUnknown ? (
        <div className="text-base-content/40 font-medium select-none">
          Preview unavailable
        </div>
      ) : previewUrl ? (
        <>
          {isImage && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Open full preview"
            >
              <img
                src={previewUrl}
                alt="Post media preview"
                className="w-full h-full object-contain"
              />
            </button>
          )}

          {isVideo && (
            <div className="w-full h-full relative group">
              <video
                src={previewUrl}
                controls
                preload="metadata"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-2 right-2 btn btn-sm btn-circle bg-black/50 text-white border-none hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                aria-label="Open full preview"
              >
                ⛶
              </button>
            </div>
          )}

          <MediaPreviewModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            previewUrl={previewUrl}
            mimeType={mimeType}
          />
        </>
      ) : (
        <div className="w-full h-full bg-base-200/20"></div>
      )}
    </div>
    </div>
  );
};

export default MediaPreview;
