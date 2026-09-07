import { useEffect, useMemo, useState } from 'react';
import { MOCK_BUILDINGS, MOCK_ROOMS, MOCK_SCHEDULES } from '../data/mockData';
import type { DayOfWeek, FilterState, OccupiedReservation, Room, RoomStatusResult, RoomType } from '../types';
import { evaluateRoomStatus } from '../utils/timetableEngine';
import { useLiveTime } from './useLiveTime';

export function useTimetableEngine() {
  const liveTime = useLiveTime();

  // Primary state for user filters
  const [filters, setFilters] = useState<FilterState>({
    isLiveMode: true,
    selectedDay: liveTime.dayOfWeek,
    selectedTime: liveTime.time24h,
    selectedBuilding: 'all',
    selectedFloors: [], // Empty array = all floors
    selectedType: 'all',
    searchQuery: '',
    sortBy: 'classroom',
  });

  // User / Faculty dynamic room reservations (persisted in localStorage)
  const [userReservations, setUserReservations] = useState<OccupiedReservation[]>(() => {
    try {
      const saved = localStorage.getItem('campusspace_reservations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('campusspace_reservations', JSON.stringify(userReservations));
    } catch (e) {
      console.error('Failed to save reservations to localStorage', e);
    }
  }, [userReservations]);

  // Modal & Drawer Selection States
  const [detailRoom, setDetailRoom] = useState<Room | null>(null);
  const [weeklyRoom, setWeeklyRoom] = useState<Room | null>(null);
  const [occupyTarget, setOccupyTarget] = useState<RoomStatusResult | null>(null);
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);

  // Active evaluation time and day (Live clock vs user custom pick)
  const activeDay: DayOfWeek = filters.isLiveMode ? liveTime.dayOfWeek : filters.selectedDay;
  const activeTime: string = filters.isLiveMode ? liveTime.time24h : filters.selectedTime;

  // Calculate status for all rooms based on active day & time & reservations
  const allRoomStatuses = useMemo(() => {
    return MOCK_ROOMS.map((room) =>
      evaluateRoomStatus(room, MOCK_SCHEDULES, activeDay, activeTime, userReservations)
    );
  }, [activeDay, activeTime, userReservations]);

  // Apply visual filters (Building, Multi-Floor, Room Type, Search Query, Sorting)
  const filteredStatuses = useMemo(() => {
    const list = allRoomStatuses.filter((status) => {
      const { room } = status;

      // 1. Building filter
      if (filters.selectedBuilding !== 'all' && room.buildingId !== filters.selectedBuilding) {
        return false;
      }

      // 2. Multi-floor filter (if selectedFloors is not empty, room.floor must be included)
      if (filters.selectedFloors.length > 0 && !filters.selectedFloors.includes(room.floor)) {
        return false;
      }

      // 3. Room type filter
      if (filters.selectedType !== 'all' && room.type !== filters.selectedType) {
        return false;
      }

      // 4. Search query (matches Room name, code, subject name, subject code, or faculty)
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase().trim();
        const roomMatch =
          room.name.toLowerCase().includes(query) ||
          room.code.toLowerCase().includes(query) ||
          room.buildingName.toLowerCase().includes(query) ||
          (room.departmentName && room.departmentName.toLowerCase().includes(query));

        let scheduleMatch = false;
        if (status.currentSchedule) {
          const cs = status.currentSchedule;
          scheduleMatch =
            cs.subjectCode.toLowerCase().includes(query) ||
            cs.subjectName.toLowerCase().includes(query) ||
            cs.facultyName.toLowerCase().includes(query) ||
            cs.batch.toLowerCase().includes(query);
        }

        if (!roomMatch && !scheduleMatch) {
          return false;
        }
      }

      return true;
    });

    // Apply Sorting (by classroom or by class)
    return list.sort((a, b) => {
      if (filters.sortBy === 'class') {
        // Occupied (with current class) first, then available rooms
        if (a.isAvailable !== b.isAvailable) {
          return a.isAvailable ? 1 : -1;
        }
        if (a.currentSchedule && b.currentSchedule) {
          return a.currentSchedule.subjectCode.localeCompare(b.currentSchedule.subjectCode);
        }
      }
      // Default / Classroom sorting: Sort by floor then room name
      if (a.room.floor !== b.room.floor) {
        return a.room.floor - b.room.floor;
      }
      return a.room.name.localeCompare(b.room.name);
    });
  }, [allRoomStatuses, filters]);

  // Overall Statistics Summary (Before & After Sorting/Filtering)
  const statistics = useMemo(() => {
    const total = allRoomStatuses.length;
    const available = allRoomStatuses.filter((s) => s.isAvailable).length;
    const occupied = total - available;

    // Classrooms count (before & after filtering)
    const totalClassrooms = allRoomStatuses.filter((s) => s.room.type === 'classroom').length;
    const filteredClassrooms = filteredStatuses.filter((s) => s.room.type === 'classroom').length;

    // Labs count (before & after filtering: computer labs & science labs)
    const isLab = (t: RoomType) => t === 'computer_lab' || t === 'science_lab';
    const totalLabs = allRoomStatuses.filter((s) => isLab(s.room.type)).length;
    const filteredLabs = filteredStatuses.filter((s) => isLab(s.room.type)).length;

    // Currently occupied classes list in the filtered selection
    const occupiedClasses = filteredStatuses.filter((s) => !s.isAvailable && s.currentSchedule);

    return {
      total,
      available,
      occupied,
      totalClassrooms,
      filteredClassrooms,
      totalLabs,
      filteredLabs,
      occupiedClasses,
    };
  }, [allRoomStatuses, filteredStatuses]);

  // Filter Updater Handlers
  const toggleLiveMode = (isLive: boolean) => {
    setFilters((prev) => ({
      ...prev,
      isLiveMode: isLive,
      selectedDay: isLive ? liveTime.dayOfWeek : prev.selectedDay,
      selectedTime: isLive ? liveTime.time24h : prev.selectedTime,
    }));
  };

  const setSelectedDay = (day: DayOfWeek) => {
    setFilters((prev) => ({ ...prev, selectedDay: day, isLiveMode: false }));
  };

  const setSelectedTime = (time: string) => {
    setFilters((prev) => ({ ...prev, selectedTime: time, isLiveMode: false }));
  };

  const setSelectedBuilding = (buildingId: string) => {
    setFilters((prev) => ({ ...prev, selectedBuilding: buildingId }));
  };

  const toggleFloorSelection = (floor: number | 'all') => {
    setFilters((prev) => {
      if (floor === 'all') {
        return { ...prev, selectedFloors: [] };
      }
      const exists = prev.selectedFloors.includes(floor);
      const newFloors = exists
        ? prev.selectedFloors.filter((f) => f !== floor)
        : [...prev.selectedFloors, floor];
      return { ...prev, selectedFloors: newFloors };
    });
  };

  const setSelectedType = (type: RoomType | 'all') => {
    setFilters((prev) => ({ ...prev, selectedType: type }));
  };

  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

<<<<<<< HEAD
  const setSortBy = (sortBy: 'classroom' | 'class') => {
    setFilters((prev) => ({ ...prev, sortBy }));
=======
  const addReservation = (reservation: OccupiedReservation) => {
    setUserReservations((prev) => [...prev, reservation]);
    setOccupyTarget(null);
  };

  const removeReservation = (reservationId: string) => {
    setUserReservations((prev) => prev.filter((r) => r.id !== reservationId));
>>>>>>> ed788a8 (Changes are done)
  };

  return {
    buildings: MOCK_BUILDINGS,
    schedules: MOCK_SCHEDULES,
    filters,
    liveTime,
    activeDay,
    activeTime,
    filteredStatuses,
    statistics,
    toggleLiveMode,
    setSelectedDay,
    setSelectedTime,
    setSelectedBuilding,
    toggleFloorSelection,
    setSelectedType,
    setSearchQuery,
<<<<<<< HEAD
    setSortBy,
=======
    // Dynamic Occupy System
    userReservations,
    addReservation,
    removeReservation,
    occupyTarget,
    setOccupyTarget,
>>>>>>> ed788a8 (Changes are done)
    // Modals & Drawers
    detailRoom,
    setDetailRoom,
    weeklyRoom,
    setWeeklyRoom,
    isRecommendOpen,
    setIsRecommendOpen,
  };
}
