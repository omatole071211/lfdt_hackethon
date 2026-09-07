export type RoomType = 'classroom' | 'computer_lab' | 'science_lab' | 'seminar_hall';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface Amenities {
  hasWhiteboard: boolean;
  computerCount?: number;
  powerOutlets: boolean;
  seatingCapacity?: number;
  hasProjector?: boolean;
  hasAC?: boolean;
}

export interface Building {
  id: string;
  name: string;
  code: string;
  totalFloors: number;
}

export interface Room {
  id: string;
  name: string;
  code: string;
  buildingId: string;
  buildingName: string;
  floor: number;
  departmentName?: string;
  type: RoomType;
  amenities: Amenities;
}

export interface ScheduleSlot {
  id: string;
  roomId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // 24hr format "09:00"
  endTime: string;   // 24hr format "10:00"
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  batch: string;
}

export interface OccupiedReservation {
  id: string;
  roomId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "10:00"
  endTime: string;   // "11:00"
  facultyName: string;
  subjectName: string;
  batch: string;
  purpose?: string;
  createdAt: string;
}

export interface RoomStatusResult {
  room: Room;
  isAvailable: boolean;
  currentSchedule?: ScheduleSlot;
  nextSchedule?: ScheduleSlot;
  freeUntil?: string;
  nextAvailableTime?: string;
  availableDurationMins?: number;
  isFacultyOccupied?: boolean;
  activeReservation?: OccupiedReservation;
}

export interface FilterState {
  isLiveMode: boolean;
  selectedDay: DayOfWeek;
  selectedTime: string; // 24hr "10:30"
  selectedBuilding: string; // 'all' or buildingId
  selectedFloors: number[]; // empty array means 'all', or list of selected floor numbers
  selectedType: RoomType | 'all';
  searchQuery: string;
  sortBy: 'classroom' | 'class';
}

export type RecommendPurpose = 'classroom' | 'lab' | 'seminar_hall' | 'science_lab';
export type GroupSize = 'small' | 'large';

export interface RecommendationQuery {
  purpose: RecommendPurpose;
  groupSize: GroupSize;
  buildingId: string; // 'all' or specific
  needComputers?: boolean;
  needProjector?: boolean;
}

export interface RecommendationResult {
  roomStatus: RoomStatusResult;
  score: number;
  matchReasons: string[];
}
