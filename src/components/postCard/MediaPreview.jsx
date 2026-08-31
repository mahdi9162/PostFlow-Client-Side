import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import MediaPreviewModal from './MediaPreviewModal';
import PawLoader from '../common/PawLoader';

const MediaPreview = ({ post, reviewNumber }) => {
  const axiosSecure = useAxiosSecure();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
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
    setIsMediaLoaded(false);
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
  const isWaitingForMedia = isLoading || (previewUrl && !isMediaLoaded && !hasError && !isUnknown);

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
        {/* Loading / decoding state with PawLoader */}
        {isWaitingForMedia && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-base-200/60 backdrop-blur-[2px] animate-pulse">
            <PawLoader size="sm" />
          </div>
        )}

        {/* Error or unsupported format state */}
        {(hasError || isUnknown) && (
          <div className="flex flex-col items-center justify-center gap-2 text-base-content/40 font-medium select-none p-4 text-center">
            <AlertCircle className="size-6 opacity-60 text-warning" />
            <span className="text-xs sm:text-sm">Preview unavailable</span>
          </div>
        )}

        {/* Media elements */}
        {previewUrl && !hasError && !isUnknown && (
          <>
            {isImage && (
              <button
                onClick={() => setIsModalOpen(true)}
                className={`w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-opacity duration-300 ${
                  isMediaLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                aria-label="Open full preview"
              >
                <img
                  src={previewUrl}
                  alt="Post media preview"
                  onLoad={() => setIsMediaLoaded(true)}
                  onError={() => {
                    setHasError(true);
                    setIsMediaLoaded(false);
                  }}
                  className="w-full h-full object-contain"
                />
              </button>
            )}

            {isVideo && (
              <div 
                className={`w-full h-full relative group transition-opacity duration-300 ${
                  isMediaLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <video
                  src={previewUrl}
                  controls
                  preload="metadata"
                  onLoadedData={() => setIsMediaLoaded(true)}
                  onError={() => {
                    setHasError(true);
                    setIsMediaLoaded(false);
                  }}
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
        )}
      </div>
    </div>
  );
};

export default MediaPreview;
