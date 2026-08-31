import React from 'react';
import { PawPrint } from 'lucide-react';

const sizeMap = {
  xs: { icon: 'size-3.5', gap: 'gap-1', text: 'text-[10px]' },
  sm: { icon: 'size-5', gap: 'gap-1.5', text: 'text-xs' },
  md: { icon: 'size-7', gap: 'gap-2', text: 'text-sm' },
  lg: { icon: 'size-9', gap: 'gap-2.5', text: 'text-sm' },
  xl: { icon: 'size-12', gap: 'gap-3', text: 'text-base' },
};

const PawLoader = ({ 
  size = 'md', 
  message, 
  className = '',
  layout = 'vertical'
}) => {
  const selectedSize = sizeMap[size] || sizeMap.md;
  const isHorizontal = layout === 'horizontal';

  return (
    <div 
      className={`inline-flex ${isHorizontal ? 'flex-row items-center' : 'flex-col items-center justify-center'} ${selectedSize.gap} select-none ${className}`}
      role="status"
      aria-label={message || 'Loading...'}
    >
      <div className="relative flex items-center justify-center">
        {/* Soft background aura */}
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-md scale-125 motion-safe:animate-pulse pointer-events-none" />

        {/* Dual Stepping Paws */}
        <div className="relative flex items-center gap-1 py-0.5">
          <div 
            className="text-primary/75 transform -rotate-12 transition-transform motion-safe:animate-pulse"
            style={{ animationDuration: '1.2s', animationDelay: '0ms' }}
          >
            <PawPrint className={selectedSize.icon} />
          </div>
          <div 
            className="text-primary transform rotate-12 transition-transform motion-safe:animate-pulse"
            style={{ animationDuration: '1.2s', animationDelay: '300ms' }}
          >
            <PawPrint className={selectedSize.icon} />
          </div>
        </div>
      </div>

      {message && (
        <p className={`font-medium text-base-content/70 text-center tracking-wide motion-safe:animate-pulse ${selectedSize.text}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default PawLoader;
