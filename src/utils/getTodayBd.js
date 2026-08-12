export const getTodayBd = () => {
  const day = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: 'Asia/Dhaka',
  }).format(new Date());

  return day.toLocaleLowerCase();
};
