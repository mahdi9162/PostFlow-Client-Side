import { format } from 'date-fns';

/**
 * Parses any date value into a valid Date object or null.
 * Handles null/undefined/empty, Date instances, timestamps,
 * and date-only YYYY-MM-DD strings safely to prevent UTC midnight shifts.
 */
const toValidDate = (dateValue) => {
  if (!dateValue) return null;

  if (dateValue instanceof Date) {
    return Number.isNaN(dateValue.getTime()) ? null : dateValue;
  }

  // Handle date-only "YYYY-MM-DD" strings to prevent UTC midnight timezone shifts
  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    const [year, month, day] = dateValue.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    return Number.isNaN(localDate.getTime()) ? null : localDate;
  }

  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Format: "Sep 1, 2026"
 * Used in: Sync History Target Date, Sync Run Details Target Date, Cleanup Modal, Access Requests
 */
export const formatDisplayDate = (dateValue, fallback = '—') => {
  const date = toValidDate(dateValue);
  return date ? format(date, 'MMM d, yyyy') : fallback;
};

/**
 * Format: "Sep 1, 2026 4:28 PM"
 * Used in: Started/Completed timestamps, Stale Sync Preview timestamps
 */
export const formatDisplayDateTime = (dateValue, fallback = '—') => {
  const date = toValidDate(dateValue);
  return date ? format(date, 'MMM d, yyyy h:mm a') : fallback;
};

/**
 * Format: "4:28 PM"
 * Used in: Sync History Started column, Latest Sync Card subtitle
 */
export const formatDisplayTime = (dateValue, fallback = '—') => {
  const date = toValidDate(dateValue);
  return date ? format(date, 'h:mm a') : fallback;
};

/**
 * Format: "01 Sep 2026, 4:28 PM"
 * Used in: LatestMaintenanceCard (Drive Automation run logs)
 */
export const formatMaintenanceDateTime = (dateValue, fallback = '—') => {
  const date = toValidDate(dateValue);
  return date ? format(date, 'dd MMM yyyy, h:mm a') : fallback;
};

/**
 * Format: "Tuesday, Sep 1"
 * Used in: PostCard feed header
 */
export const formatFeedHeaderDate = (dateValue, fallback = '—') => {
  const date = toValidDate(dateValue);
  return date ? format(date, 'EEEE, MMM d') : fallback;
};
