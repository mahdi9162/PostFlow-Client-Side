export const formatDuration = (start, end) => {
  if (!start || !end) return '—';
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (ms < 0) return '—';
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  if (minutes < 60) {
    return `${minutes} min${remainingSecs > 0 ? ` ${remainingSecs} sec` : ''}`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `${hours} hr${remainingMins > 0 ? ` ${remainingMins} min` : ''}`;
};
