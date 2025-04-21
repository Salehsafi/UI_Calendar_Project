
export function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const numDays = lastDay.getDate();
  
  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay();
  
  // Previous month days to show
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevMonthDays = Array.from({ length: firstDayOfWeek }, (_, i) => ({
    day: prevMonthLastDay - firstDayOfWeek + i + 1,
    currentMonth: false,
    date: new Date(year, month - 1, prevMonthLastDay - firstDayOfWeek + i + 1)
  }));
  
  // Current month days
  const currentMonthDays = Array.from({ length: numDays }, (_, i) => ({
    day: i + 1,
    currentMonth: true,
    date: new Date(year, month, i + 1)
  }));
  
  // Next month days to show
  const totalDays = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDays = Array.from({ length: 42 - totalDays }, (_, i) => ({
    day: i + 1,
    currentMonth: false,
    date: new Date(year, month + 1, i + 1)
  }));
  
  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export function isSameDate(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

export function getMonthName(month: number): string {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  return monthNames[month];
}

export const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
