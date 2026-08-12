import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ message = 'Something went wrong.', onRetry = null }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center w-full rounded-2xl border border-error/20 bg-error/5">
      <AlertCircle className="size-10 text-error mb-4" />
      <h3 className="text-lg font-semibold text-base-content">Error</h3>
      <p className="mt-1 text-sm text-base-content/70 max-w-sm">{message}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="mt-6 btn btn-sm btn-outline btn-error rounded-xl"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
