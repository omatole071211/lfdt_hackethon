import { BUILDINGS, ROOMS, SCHEDULES } from '../data/db.js';
import { evaluateRoomStatus, recommendRooms } from '../services/timetableService.js';

export function getBuildings(req, res) {
  res.json(BUILDINGS);
}

export function getRooms(req, res) {
  const { buildingId, floor, type } = req.query;

  let result = [...ROOMS];

  if (buildingId && buildingId !== 'all') {
    result = result.filter((r) => r.buildingId === buildingId);
  }
  if (floor && floor !== 'all') {
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
  const { day = 'Monday', time = '10:00', buildingId, floor, type, q } = req.query;

  let roomsToEvaluate = [...ROOMS];

  if (buildingId && buildingId !== 'all') {
    roomsToEvaluate = roomsToEvaluate.filter((r) => r.buildingId === buildingId);
  }
  if (floor && floor !== 'all') {
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
        status.room.buildingName.toLowerCase().includes(query);

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

  res.json({
    activeDay: day,
    activeTime: time,
    totalRooms: statuses.length,
    statuses,
  });
}

export function getRecommendations(req, res) {
  const {
    purpose = 'study',
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
  const freeComputerLabs = statuses.filter(
    (s) => s.isAvailable && s.room.type === 'computer_lab'
  ).length;
  const freeSeminarHalls = statuses.filter(
    (s) => s.isAvailable && s.room.type === 'seminar_hall'
  ).length;

  res.json({
    total,
    available,
    occupied,
    freeComputerLabs,
    freeSeminarHalls,
  });
}
