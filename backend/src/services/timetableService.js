const ACADEMIC_DAY_END = '17:30';

export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function evaluateRoomStatus(room, schedules, day, targetTime) {
  const targetMins = timeToMinutes(targetTime);

  const roomSlots = schedules
    .filter((s) => s.roomId === room.id && s.dayOfWeek === day)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  const activeSlot = roomSlots.find((s) => {
    const startMins = timeToMinutes(s.startTime);
    const endMins = timeToMinutes(s.endTime);
    return targetMins >= startMins && targetMins < endMins;
  });

  if (activeSlot) {
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

export function recommendRooms(rooms, schedules, query, day, targetTime) {
  const evaluatedRooms = rooms.map((r) => evaluateRoomStatus(r, schedules, day, targetTime));
  const availableRooms = evaluatedRooms.filter(
    (res) => res.isAvailable && (res.availableDurationMins || 0) > 15
  );

  const scored = availableRooms.map((res) => {
    let score = 0;
    const matchReasons = [];

    const duration = res.availableDurationMins || 0;
    const durationScore = Math.min(100, Math.floor(duration / 1.5));
    score += durationScore;
    matchReasons.push(`Free for ${Math.floor(duration / 60)}h ${duration % 60}m uninterrupted`);

    if (query.purpose === 'lab') {
      if (res.room.type === 'computer_lab' || res.room.type === 'science_lab') {
        score += 80;
        matchReasons.push('Equipped lab facility for practical work');
      }
    } else if (query.purpose === 'study') {
      if (res.room.type === 'classroom') {
        score += 50;
        matchReasons.push('Ideal quiet study environment');
      }
    } else if (query.purpose === 'group') {
      if (res.room.amenities.seatingCapacity >= 30) {
        score += 50;
        matchReasons.push(`Spacious seating (${res.room.amenities.seatingCapacity} seats)`);
      }
    }

    if (query.needComputers && (res.room.amenities.computerCount || 0) > 0) {
      score += 50;
      matchReasons.push(`Has ${res.room.amenities.computerCount} desktop PCs`);
    }

    if (query.needProjector && res.room.amenities.hasProjector) {
      score += 30;
      matchReasons.push('HD Projector / Smart Board available');
    }

    if (query.buildingId && query.buildingId !== 'all') {
      if (res.room.buildingId === query.buildingId) {
        score += 60;
        matchReasons.push(`Located in requested building (${res.room.buildingName})`);
      }
    }

    return {
      roomStatus: res,
      score,
      matchReasons,
    };
  });

  return scored.sort((a, b) => b.score - a.score);
}
