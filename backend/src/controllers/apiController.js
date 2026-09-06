import { BUILDINGS, ROOMS, SCHEDULES } from '../data/db.js';
import { evaluateRoomStatus, recommendRooms } from '../services/timetableService.js';

export function getBuildings(req, res) {
  res.json(BUILDINGS);
}

export function getRooms(req, res) {
  const { buildingId, floor, floors, type } = req.query;

  let result = [...ROOMS];

  if (buildingId && buildingId !== 'all') {
    result = result.filter((r) => r.buildingId === buildingId);
  }

  // Handle multi-floor array parameter or single floor
  if (floors) {
    const floorNums = floors.split(',').map((f) => Number(f.trim())).filter((n) => !isNaN(n));
    if (floorNums.length > 0) {
      result = result.filter((r) => floorNums.includes(r.floor));
    }
  } else if (floor && floor !== 'all') {
    result = result.filter((r) => r.floor === Number(floor));
  }

  if (type && type !== 'all') {
    result = result.filter((r) => r.type === type);
  }

  res.json(result);
}

export function getSchedules(req, res) {
  const { roomId, day } = req.query;

  let result = [...SCHEDULES];

  if (roomId) {
    result = result.filter((s) => s.roomId === roomId);
  }
  if (day) {
    result = result.filter((s) => s.dayOfWeek === day);
  }

  res.json(result);
}

export function getAvailability(req, res) {
  const { day = 'Monday', time = '10:00', buildingId, floor, floors, type, q, sortBy } = req.query;

  let roomsToEvaluate = [...ROOMS];

  if (buildingId && buildingId !== 'all') {
    roomsToEvaluate = roomsToEvaluate.filter((r) => r.buildingId === buildingId);
  }

  // Handle multi-floor or single floor filtering
  if (floors) {
    const floorNums = floors.split(',').map((f) => Number(f.trim())).filter((n) => !isNaN(n));
    if (floorNums.length > 0) {
      roomsToEvaluate = roomsToEvaluate.filter((r) => floorNums.includes(r.floor));
    }
  } else if (floor && floor !== 'all') {
    roomsToEvaluate = roomsToEvaluate.filter((r) => r.floor === Number(floor));
  }

  if (type && type !== 'all') {
    roomsToEvaluate = roomsToEvaluate.filter((r) => r.type === type);
  }

  let statuses = roomsToEvaluate.map((room) =>
    evaluateRoomStatus(room, SCHEDULES, day, time)
  );

  if (q && q.trim() !== '') {
    const query = q.toLowerCase().trim();
    statuses = statuses.filter((status) => {
      const roomMatch =
        status.room.name.toLowerCase().includes(query) ||
        status.room.code.toLowerCase().includes(query) ||
        status.room.buildingName.toLowerCase().includes(query) ||
        (status.room.departmentName && status.room.departmentName.toLowerCase().includes(query));

      let scheduleMatch = false;
      if (status.currentSchedule) {
        const cs = status.currentSchedule;
        scheduleMatch =
          cs.subjectCode.toLowerCase().includes(query) ||
          cs.subjectName.toLowerCase().includes(query) ||
          cs.facultyName.toLowerCase().includes(query) ||
          cs.batch.toLowerCase().includes(query);
      }

      return roomMatch || scheduleMatch;
    });
  }

  // Optional sorting by classroom or class
  if (sortBy === 'class') {
    statuses.sort((a, b) => {
      if (a.isAvailable !== b.isAvailable) return a.isAvailable ? 1 : -1;
      return a.room.name.localeCompare(b.room.name);
    });
  } else {
    statuses.sort((a, b) => a.room.name.localeCompare(b.room.name));
  }

  res.json({
    activeDay: day,
    activeTime: time,
    totalRooms: statuses.length,
    statuses,
  });
}

export function getRecommendations(req, res) {
  const {
    purpose = 'classroom',
    groupSize = 'small',
    buildingId = 'all',
    needComputers = false,
    needProjector = false,
    day = 'Monday',
    time = '10:00',
  } = req.body;

  const recs = recommendRooms(
    ROOMS,
    SCHEDULES,
    { purpose, groupSize, buildingId, needComputers, needProjector },
    day,
    time
  );

  res.json({
    count: recs.length,
    recommendations: recs,
  });
}

export function getAnalytics(req, res) {
  const { day = 'Monday', time = '10:00' } = req.query;

  const statuses = ROOMS.map((room) =>
    evaluateRoomStatus(room, SCHEDULES, day, time)
  );

  const total = statuses.length;
  const available = statuses.filter((s) => s.isAvailable).length;
  const occupied = total - available;

  const totalClassrooms = ROOMS.filter((r) => r.type === 'classroom').length;
  const totalLabs = ROOMS.filter((r) => r.type === 'computer_lab' || r.type === 'science_lab').length;

  res.json({
    total,
    available,
    occupied,
    totalClassrooms,
    totalLabs,
  });
}
