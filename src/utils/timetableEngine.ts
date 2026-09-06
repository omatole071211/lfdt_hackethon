import type {
  DayOfWeek,
  RecommendationQuery,
  RecommendationResult,
  Room,
  RoomStatusResult,
  ScheduleSlot,
} from '../types';
import { timeToMinutes } from './timeHelpers';

// End of academic day standard (5:30 PM = 17:30)
const ACADEMIC_DAY_END = '17:30';

/**
 * Determines exact room availability status for a specific day and time
 */
export function evaluateRoomStatus(
  room: Room,
  schedules: ScheduleSlot[],
  day: DayOfWeek,
  targetTime: string
): RoomStatusResult {
  const targetMins = timeToMinutes(targetTime);

  // Filter & sort all slots for this room on the selected day
  const roomSlots = schedules
    .filter((s) => s.roomId === room.id && s.dayOfWeek === day)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  // 1. Check for active ongoing schedule slot
  const activeSlot = roomSlots.find((s) => {
    const startMins = timeToMinutes(s.startTime);
    const endMins = timeToMinutes(s.endTime);
    return targetMins >= startMins && targetMins < endMins;
  });

  if (activeSlot) {
    // Room is OCCUPIED
    const nextSlotAfterCurrent = roomSlots.find(
      (s) => timeToMinutes(s.startTime) >= timeToMinutes(activeSlot.endTime)
    );

    return {
      room,
      isAvailable: false,
      currentSchedule: activeSlot,
      nextSchedule: nextSlotAfterCurrent,
      nextAvailableTime: activeSlot.endTime,
    };
  }

  // 2. Room is AVAILABLE — Find next upcoming schedule slot today
  const upcomingSlot = roomSlots.find((s) => timeToMinutes(s.startTime) > targetMins);

  const freeUntil = upcomingSlot ? upcomingSlot.startTime : ACADEMIC_DAY_END;
  const freeUntilMins = timeToMinutes(freeUntil);
  const availableDurationMins = Math.max(0, freeUntilMins - targetMins);

  return {
    room,
    isAvailable: true,
    nextSchedule: upcomingSlot,
    freeUntil,
    availableDurationMins,
  };
}

/**
 * Smart recommendation engine scoring free rooms based on user criteria
 */
export function recommendRooms(
  rooms: Room[],
  schedules: ScheduleSlot[],
  query: RecommendationQuery,
  day: DayOfWeek,
  targetTime: string
): RecommendationResult[] {
  const evaluatedRooms = rooms.map((r) => evaluateRoomStatus(r, schedules, day, targetTime));

  // Only evaluate currently available rooms
  const availableRooms = evaluatedRooms.filter((res) => res.isAvailable && (res.availableDurationMins || 0) > 15);

  const scoredResults: RecommendationResult[] = availableRooms.map((res) => {
    let score = 0;
    const matchReasons: string[] = [];

    // Duration score (up to +100 points based on free minutes)
    const duration = res.availableDurationMins || 0;
    const durationScore = Math.min(100, Math.floor(duration / 1.5));
    score += durationScore;
    matchReasons.push(`Free for ${Math.floor(duration / 60)}h ${duration % 60}m uninterrupted`);

    // Purpose match score
    if (query.purpose === 'lab') {
      if (res.room.type === 'computer_lab' || res.room.type === 'science_lab') {
        score += 80;
        matchReasons.push('Equipped lab facility for practical work');
      } else {
        score -= 40;
      }
    } else if (query.purpose === 'study') {
      if (res.room.type === 'classroom') {
        score += 50;
        matchReasons.push('Ideal quiet study environment');
      }
    } else if (query.purpose === 'group') {
      if (res.room.amenities.seatingCapacity >= 30) {
        score += 50;
        matchReasons.push(`Spacious seating (${res.room.amenities.seatingCapacity} seats) for collaboration`);
      }
    } else if (query.purpose === 'lecture') {
      if (res.room.type === 'seminar_hall' || res.room.amenities.seatingCapacity >= 80) {
        score += 70;
        matchReasons.push('High-capacity hall suitable for presentations');
      }
    }

    // Seating capacity preference
    if (query.groupSize === 'single' && res.room.amenities.seatingCapacity <= 60) {
      score += 20;
    } else if (query.groupSize === 'small' && res.room.amenities.seatingCapacity >= 30) {
      score += 20;
    } else if (query.groupSize === 'large' && res.room.amenities.seatingCapacity >= 80) {
      score += 40;
      matchReasons.push('Large capacity seating');
    }

    // Equipment preferences
    if (query.needComputers && (res.room.amenities.computerCount || 0) > 0) {
      score += 50;
      matchReasons.push(`Has ${res.room.amenities.computerCount} desktop PCs`);
    }
    if (query.needProjector && res.room.amenities.hasProjector) {
      score += 30;
      matchReasons.push('HD Projector / Smart Display available');
    }

    // Building proximity filter
    if (query.buildingId !== 'all') {
      if (res.room.buildingId === query.buildingId) {
        score += 60;
        matchReasons.push(`Located in selected ${res.room.buildingName}`);
      } else {
        score -= 50;
      }
    }

    // Floor proximity bonus (Ground & 1st floor preferred for quick access)
    if (res.room.floor <= 1) {
      score += 15;
      matchReasons.push(`Quick access on Floor ${res.room.floor === 0 ? 'Ground' : res.room.floor}`);
    }

    return {
      roomStatus: res,
      score,
      matchReasons,
    };
  });

  // Sort descending by score
  return scoredResults.sort((a, b) => b.score - a.score);
}
