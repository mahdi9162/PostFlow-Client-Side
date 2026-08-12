export const formatInstagramPostText = (post) => {
  if (!post) return '';

  const caption  = post.caption?.trim()  || '';
  const cta      = post.cta?.trim()      || '';
  const source   = post.source?.trim()   || '';
  const hashtags = post.hashtags?.trim() || '';

  const DOT = '.';
  const lines = [];

  if (caption)  lines.push(caption);
  if (cta)      lines.push(cta);

  if (source) {
    // 4 separator dots · Source line · 4 separator dots
    lines.push(...Array(4).fill(DOT));
    lines.push(`Source: ${source}`);
    lines.push(...Array(4).fill(DOT));
  } else {
    // 8 separator dots
    lines.push(...Array(8).fill(DOT));
  }

  if (hashtags) lines.push(hashtags);

  return lines.join('\n');
};
