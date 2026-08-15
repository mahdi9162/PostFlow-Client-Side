import { getTodayDateBd } from './getTodayDateBd';

export const getTomorrowDateBd = () => {
  const todayStr = getTodayDateBd(); // returns YYYY-MM-DD
  const [year, month, day] = todayStr.split('-').map(Number);
  
  // Perform calendar math in UTC to remain independent of the browser's local timezone
  const d = new Date(Date.UTC(year, month - 1, day + 1));
  
  const nextYear = d.getUTCFullYear();
  const nextMonth = String(d.getUTCMonth() + 1).padStart(2, '0');
  const nextDay = String(d.getUTCDate()).padStart(2, '0');
  
  return `${nextYear}-${nextMonth}-${nextDay}`;
};
