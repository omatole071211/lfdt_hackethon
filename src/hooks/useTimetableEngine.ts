import { useMemo, useState } from 'react';
import { MOCK_BUILDINGS, MOCK_ROOMS, MOCK_SCHEDULES } from '../data/mockData';
import type { DayOfWeek, FilterState, Room, RoomType } from '../types';
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
    selectedFloor: 'all',
    selectedType: 'all',
    searchQuery: '',
  });

  // Modal & Drawer Selection States
  const [detailRoom, setDetailRoom] = useState<Room | null>(null);
  const [weeklyRoom, setWeeklyRoom] = useState<Room | null>(null);
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);

  // Active evaluation time and day (Live clock vs user custom pick)
  const activeDay: DayOfWeek = filters.isLiveMode ? liveTime.dayOfWeek : filters.selectedDay;
  const activeTime: string = filters.isLiveMode ? liveTime.time24h : filters.selectedTime;

  // Calculate status for all rooms based on active day & time
  const allRoomStatuses = useMemo(() => {
    return MOCK_ROOMS.map((room) =>
      evaluateRoomStatus(room, MOCK_SCHEDULES, activeDay, activeTime)
    );
  }, [activeDay, activeTime]);

  // Apply visual filters (Building, Floor, Room Type, Search Query)
  const filteredStatuses = useMemo(() => {
    return allRoomStatuses.filter((status) => {
      const { room } = status;

      // 1. Building filter
      if (filters.selectedBuilding !== 'all' && room.buildingId !== filters.selectedBuilding) {
        return false;
      }

      // 2. Floor filter
      if (filters.selectedFloor !== 'all' && room.floor !== Number(filters.selectedFloor)) {
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
          room.buildingName.toLowerCase().includes(query);

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
  }, [allRoomStatuses, filters]);

  // Overall Statistics Summary
  const statistics = useMemo(() => {
    const total = allRoomStatuses.length;
    const available = allRoomStatuses.filter((s) => s.isAvailable).length;
    const occupied = total - available;
    const freeComputerLabs = allRoomStatuses.filter(
      (s) => s.isAvailable && s.room.type === 'computer_lab'
    ).length;
    const freeSeminarHalls = allRoomStatuses.filter(
      (s) => s.isAvailable && s.room.type === 'seminar_hall'
    ).length;

    return {
      total,
      available,
      occupied,
      freeComputerLabs,
      freeSeminarHalls,
    };
  }, [allRoomStatuses]);

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

  const setSelectedFloor = (floor: number | 'all') => {
    setFilters((prev) => ({ ...prev, selectedFloor: floor }));
  };

  const setSelectedType = (type: RoomType | 'all') => {
    setFilters((prev) => ({ ...prev, selectedType: type }));
  };

  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
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
    setSelectedFloor,
    setSelectedType,
    setSearchQuery,
    // Modals & Drawers
    detailRoom,
    setDetailRoom,
    weeklyRoom,
    setWeeklyRoom,
    isRecommendOpen,
    setIsRecommendOpen,
  };
}
