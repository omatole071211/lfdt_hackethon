import { useEffect, useState } from 'react';
import type { DayOfWeek } from '../types';
import { getCurrentDayOfWeek, getCurrentTime24h } from '../utils/timeHelpers';

export interface LiveTimeState {
  currentDate: Date;
  dayOfWeek: DayOfWeek;
  time24h: string;
}

export function useLiveTime(): LiveTimeState {
  const [liveState, setLiveState] = useState<LiveTimeState>(() => {
    const now = new Date();
    return {
      currentDate: now,
      dayOfWeek: getCurrentDayOfWeek(now),
      time24h: getCurrentTime24h(now),
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveState({
        currentDate: now,
        dayOfWeek: getCurrentDayOfWeek(now),
        time24h: getCurrentTime24h(now),
      });
    }, 10000); // update every 10s

    return () => clearInterval(timer);
  }, []);

  return liveState;
}
