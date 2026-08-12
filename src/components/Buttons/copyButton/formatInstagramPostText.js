export const formatInstagramPostText = (post) => {
  if (!post) return '';

  const blocks = [];

  if (post.caption?.trim()) {
    blocks.push(post.caption.trim());
  }

  if (post.cta?.trim()) {
    blocks.push(post.cta.trim());
  }

  if (post.source?.trim()) {
    blocks.push(post.source.trim());
  }

  if (post.hashtags?.trim()) {
    blocks.push(post.hashtags.trim());
  }

  return blocks.join('\n\n');
};
