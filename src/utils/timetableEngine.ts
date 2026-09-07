import type {
  DayOfWeek,
  OccupiedReservation,
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
  targetTime: string,
  userReservations: OccupiedReservation[] = []
): RoomStatusResult {
  // Saturday & Sunday are Weekend Holidays (Closed)
  if (day === 'Saturday' || day === 'Sunday') {
    return {
      room,
      isAvailable: false,
      isHoliday: true,
      freeUntil: undefined,
      availableDurationMins: 0,
    };
  }

  const targetMins = timeToMinutes(targetTime);

  // 1. Check for active faculty/user ad-hoc reservation
  const activeReservation = userReservations.find((r) => {
    if (r.roomId !== room.id || r.dayOfWeek !== day) return false;
    const startMins = timeToMinutes(r.startTime);
    const endMins = timeToMinutes(r.endTime);
    return targetMins >= startMins && targetMins < endMins;
  });

  if (activeReservation) {
    const reservationScheduleSlot: ScheduleSlot = {
      id: activeReservation.id,
      roomId: room.id,
      dayOfWeek: day,
      startTime: activeReservation.startTime,
      endTime: activeReservation.endTime,
      subjectCode: 'FACULTY-RESERVED',
      subjectName: activeReservation.subjectName,
      facultyName: activeReservation.facultyName,
      batch: activeReservation.batch,
    };

    return {
      room,
      isAvailable: false,
      isFacultyOccupied: true,
      activeReservation,
      currentSchedule: reservationScheduleSlot,
      nextAvailableTime: activeReservation.endTime,
    };
  }

  // Filter & sort all master timetable slots for this room on the selected day
  const roomSlots = schedules
    .filter((s) => s.roomId === room.id && s.dayOfWeek === day)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  // 2. Check for active ongoing master schedule slot
  const activeSlot = roomSlots.find((s) => {
    const startMins = timeToMinutes(s.startTime);
    const endMins = timeToMinutes(s.endTime);
    return targetMins >= startMins && targetMins < endMins;
  });

  if (activeSlot) {
    // Room is OCCUPIED by master schedule
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

  // 3. Room is AVAILABLE — Find next upcoming master schedule slot or upcoming reservation today
  const upcomingSlot = roomSlots.find((s) => timeToMinutes(s.startTime) > targetMins);
  const upcomingReservation = userReservations.find(
    (r) => r.roomId === room.id && r.dayOfWeek === day && timeToMinutes(r.startTime) > targetMins
  );

  let freeUntil = ACADEMIC_DAY_END;
  if (upcomingSlot && upcomingReservation) {
    freeUntil = timeToMinutes(upcomingSlot.startTime) < timeToMinutes(upcomingReservation.startTime)
      ? upcomingSlot.startTime
      : upcomingReservation.startTime;
  } else if (upcomingSlot) {
    freeUntil = upcomingSlot.startTime;
  } else if (upcomingReservation) {
    freeUntil = upcomingReservation.startTime;
  }

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
      if (res.room.type === 'computer_lab') {
        score += 80;
        matchReasons.push('Computer Lab facility for practical work');
      } else {
        score -= 40;
      }
    } else if (query.purpose === 'classroom') {
      if (res.room.type === 'classroom') {
        score += 60;
        matchReasons.push('Classroom suitable for study & sessions');
      }
    } else if (query.purpose === 'seminar_hall') {
      if (res.room.type === 'seminar_hall' || (res.room.amenities.seatingCapacity ?? 40) >= 80) {
        score += 70;
        matchReasons.push('Seminar Hall venue');
      }
    }

    // Seating capacity preference based on group size (2-5 vs >10)
    const cap = res.room.amenities.seatingCapacity ?? 40;
    if (query.groupSize === 'small') {
      if (cap >= 2 && cap <= 60) {
        score += 30;
        matchReasons.push('Optimal space for small groups (2–5 people)');
      }
    } else if (query.groupSize === 'large') {
      if (cap >= 60) {
        score += 40;
        matchReasons.push('Spacious room suitable for large groups (10+ people)');
      }
    }

    // Equipment preferences
    if (query.needComputers && (res.room.amenities.computerCount || 0) > 0) {
      score += 50;
      matchReasons.push(`Has ${res.room.amenities.computerCount} desktop PCs`);
    }
    if (query.needProjector && res.room.amenities.hasProjector) {
      score += 30;
      matchReasons.push('Display available');
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
