import { format } from 'date-fns';

export const formatDate = (dateValue) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime)) return '';
  return format(date, 'dd, MMM yyyy');
};
