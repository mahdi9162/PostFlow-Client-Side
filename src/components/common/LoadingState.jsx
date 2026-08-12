import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ message = 'Loading...', fullScreen = false }) => {
  const containerClass = fullScreen
    ? 'min-h-[50vh] flex flex-col items-center justify-center w-full'
    : 'flex flex-col items-center justify-center p-8 w-full';

  return (
    <div className={containerClass}>
      <Loader2 className="size-8 animate-spin text-primary" />
      {message && <p className="mt-4 text-sm font-medium text-base-content/70">{message}</p>}
    </div>
  );
};

export default LoadingState;
