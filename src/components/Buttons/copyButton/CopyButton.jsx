import React, { useState } from 'react';
import { formatInstagramPostText } from './formatInstagramPostText';

const CopyButton = ({ post }) => {
  const [copied, setCopied] = useState(false);

  const copyText = formatInstagramPostText(post);

  const handleCopyButton = async () => {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button onClick={handleCopyButton} className="btn btn-primary flex-1 py-1 md:py-0 rounded-full">
      {copied ? 'Copied ✅' : 'Copy'}
    </button>
  );
};

export default CopyButton;
