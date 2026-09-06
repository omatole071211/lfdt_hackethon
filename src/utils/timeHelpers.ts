import type { DayOfWeek } from '../types';

/**
 * Converts "HH:MM" 24hr time string into total minutes past midnight
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Converts total minutes past midnight back to "HH:MM" 24hr time string
 */
export function minutesToTime(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Converts 24hr "HH:MM" format to readable 12hr format "9:30 AM" or "02:15 PM"
 */
export function formatTime12h(timeStr: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHours = h % 12 === 0 ? 12 : h % 12;
  const displayMins = m.toString().padStart(2, '0');
  return `${displayHours}:${displayMins} ${period}`;
}

/**
 * Formats duration in minutes to human readable "1h 45m" or "45 mins"
 */
export function formatDuration(mins: number): string {
  if (mins <= 0) return '0 mins';
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (hrs === 0) {
    return `${remainingMins} mins`;
  }
  if (remainingMins === 0) {
    return `${hrs} hr${hrs > 1 ? 's' : ''}`;
  }
  return `${hrs}h ${remainingMins}m`;
}

/**
 * Gets current day of week as academic DayOfWeek (Sunday maps to Monday for demonstration)
 */
export function getCurrentDayOfWeek(date: Date = new Date()): DayOfWeek {
  const days: DayOfWeek[] = ['Monday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

/**
 * Gets current time in 24hr "HH:MM" format
 */
export function getCurrentTime24h(date: Date = new Date()): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}
