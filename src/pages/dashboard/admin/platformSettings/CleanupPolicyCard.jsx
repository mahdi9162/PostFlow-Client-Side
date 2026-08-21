import React, { useState } from 'react';
import { useCleanupPreview } from '../../../../hooks/useCleanup';
import CleanupPreviewModal from './CleanupPreviewModal';
import toast from 'react-hot-toast';

const CleanupPolicyCard = ({ title, description, targetType, isRetentionDirty, isRetentionEnabled }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  
  const { mutateAsync: fetchPreview, isPending } = useCleanupPreview();

  const handlePreview = async () => {
    try {
      const data = await fetchPreview(targetType);
      setPreviewData(data);
      setIsPreviewOpen(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to preview cleanup.');
    }
  };

  const isDisabledByDirty = isRetentionDirty;
  const isDisabledByRetention = !isRetentionEnabled;
  const isDisabled = isDisabledByDirty || isDisabledByRetention || isPending;

  return (
    <>
      <div className="rounded-2xl border border-base-200 bg-base-100 p-5 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-lg font-semibold text-base-content">{title}</h3>
          <p className="text-sm text-base-content/60 mt-1 mb-4">{description}</p>
          
          <ul className="text-xs text-base-content/50 list-disc pl-4 mb-6 space-y-1">
            {targetType === 'syncHistory' ? (
              <li>Running syncs are never deleted.</li>
            ) : (
              <li>Pending posts are never deleted.</li>
            )}
            <li>External media / Google Drive files are not deleted.</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            className="btn btn-outline rounded-xl self-start"
            onClick={handlePreview}
            disabled={isDisabled}
          >
            {isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : null}
            {isPending ? 'Previewing...' : 'Preview Cleanup'}
          </button>

          {/* Validation Messages */}
          {isDisabledByDirty && (
            <p className="text-xs font-medium text-warning bg-warning/10 p-2 rounded-lg border border-warning/20">
              Save your retention settings before running cleanup.
            </p>
          )}
          
          {!isDisabledByDirty && isDisabledByRetention && (
            <p className="text-xs font-medium text-base-content/60 bg-base-200 p-2 rounded-lg border border-base-300">
              Auto-delete is currently disabled for this data type. Enable retention and save your settings first.
            </p>
          )}
        </div>
      </div>

      <CleanupPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        previewData={previewData} 
      />
    </>
  );
};

export default CleanupPolicyCard;
