import React from 'react';
import PawLoader from './PawLoader';

const LoadingState = ({ message = 'Loading...', fullScreen = false, size = 'lg' }) => {
  const containerClass = fullScreen
    ? 'min-h-[50vh] flex flex-col items-center justify-center w-full p-8'
    : 'flex flex-col items-center justify-center p-8 w-full';

  return (
    <div className={containerClass}>
      <PawLoader size={fullScreen ? 'lg' : size} message={message} />
    </div>
  );
};

export default LoadingState;
