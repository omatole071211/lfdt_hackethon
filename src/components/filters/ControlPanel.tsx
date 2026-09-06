import React from 'react';
import {
  ArrowUpDown,
  Building as BuildingIcon,
  Calendar,
  Clock,
  Layers,
  GraduationCap,
  Monitor,
  Radio,
  Search,
  School,
  X,
} from 'lucide-react';
import type { Building, DayOfWeek, FilterState, RoomType } from '../../types';
import { formatTime12h } from '../../utils/timeHelpers';

interface ControlPanelProps {
  buildings: Building[];
  filters: FilterState;
  onToggleLiveMode: (isLive: boolean) => void;
  onSelectDay: (day: DayOfWeek) => void;
  onSelectTime: (time: string) => void;
  onSelectBuilding: (buildingId: string) => void;
  onToggleFloor: (floor: number | 'all') => void;
  onSelectType: (type: RoomType | 'all') => void;
  onSearchChange: (query: string) => void;
  onSelectSortBy: (sortBy: 'classroom' | 'class') => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const NORMAL_FLOORS = [
  { floor: 0, label: 'Ground Floor' },
  { floor: 1, label: 'Floor 1' },
  { floor: 2, label: 'Floor 2' },
  { floor: 3, label: 'Floor 3' },
  { floor: 4, label: 'Floor 4' },
  { floor: 5, label: 'Floor 5' },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  buildings,
  filters,
  onToggleLiveMode,
  onSelectDay,
  onSelectTime,
  onSelectBuilding,
  onToggleFloor,
  onSelectType,
  onSearchChange,
  onSelectSortBy,
}) => {
  const isAllFloors = filters.selectedFloors.length === 0;

  return (
    <div className="control-panel">
      {/* Search, Sort & Mode Bar */}
      <div className="control-row row-search">
        {/* Search Bar */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Check whether classroom is occupied or not (search room, subject, faculty)..."
            value={filters.searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {filters.searchQuery && (
            <button className="clear-search" onClick={() => onSearchChange('')}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="sort-group">
          <label className="sort-label">
            <ArrowUpDown size={15} /> Sort:
          </label>
          <select
            className="filter-select sort-select"
            value={filters.sortBy}
            onChange={(e) => onSelectSortBy(e.target.value as 'classroom' | 'class')}
          >
            <option value="classroom">By Classroom</option>
            <option value="class">By Class (Occupied First)</option>
          </select>
        </div>

        {/* Mode Selector (Live vs Custom Schedule) */}
        <div className="mode-toggle-group">
          <button
            className={`mode-btn ${filters.isLiveMode ? 'active' : ''}`}
            onClick={() => onToggleLiveMode(true)}
          >
            <Radio size={16} className={filters.isLiveMode ? 'icon-pulse' : ''} />
            <span>Live Now</span>
          </button>
          <button
            className={`mode-btn ${!filters.isLiveMode ? 'active' : ''}`}
            onClick={() => onToggleLiveMode(false)}
          >
            <Calendar size={16} />
            <span>Custom Schedule</span>
          </button>
        </div>
      </div>

      {/* Date, Time & Location Filters */}
      <div className="control-row row-filters">
        {/* Day Picker */}
        <div className="filter-group">
          <label className="filter-label">
            <Calendar size={14} /> Day of Week
          </label>
          <select
            className="filter-select"
            value={filters.selectedDay}
            onChange={(e) => onSelectDay(e.target.value as DayOfWeek)}
          >
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day === 'Saturday' || day === 'Sunday' ? `${day} (Holiday)` : day}
              </option>
            ))}
          </select>
        </div>

        {/* Time Selector */}
        <div className="filter-group">
          <label className="filter-label">
            <Clock size={14} /> Target Time ({formatTime12h(filters.selectedTime)})
          </label>
          <input
            type="time"
            className="filter-input-time"
            value={filters.selectedTime}
            onChange={(e) => onSelectTime(e.target.value)}
          />
        </div>

        {/* Building Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <BuildingIcon size={14} /> Building Block
          </label>
          <select
            className="filter-select"
            value={filters.selectedBuilding}
            onChange={(e) => onSelectBuilding(e.target.value)}
          >
            <option value="all">All Campus Buildings</option>
            {buildings.map((bld) => (
              <option key={bld.id} value={bld.id}>
                {bld.name} ({bld.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Normal Floor Selection Row */}
      <div className="control-row row-floors">
        <div className="filter-group group-floor width-full">
          <label className="filter-label">
            <Layers size={14} /> Floor Selection:
          </label>
          <div className="floor-tabs multi-floor-tabs">
            <button
              className={`floor-btn ${isAllFloors ? 'active' : ''}`}
              onClick={() => onToggleFloor('all')}
            >
              All Floors
            </button>
            {NORMAL_FLOORS.map(({ floor, label }) => {
              const isSelected = filters.selectedFloors.includes(floor);
              return (
                <button
                  key={floor}
                  className={`floor-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => onToggleFloor(floor)}
                  title={`Toggle ${label}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Room Type Pills */}
      <div className="control-row row-pills">
        <span className="pills-label">Room Type:</span>
        <div className="pills-container">
          <button
            className={`pill-btn ${filters.selectedType === 'all' ? 'active' : ''}`}
            onClick={() => onSelectType('all')}
          >
            All Spaces
          </button>
          <button
            className={`pill-btn ${filters.selectedType === 'classroom' ? 'active' : ''}`}
            onClick={() => onSelectType('classroom')}
          >
            <GraduationCap size={15} /> Classrooms
          </button>
          <button
            className={`pill-btn ${filters.selectedType === 'computer_lab' ? 'active' : ''}`}
            onClick={() => onSelectType('computer_lab')}
          >
            <Monitor size={15} /> Computer Labs
          </button>
          <button
            className={`pill-btn ${filters.selectedType === 'seminar_hall' ? 'active' : ''}`}
            onClick={() => onSelectType('seminar_hall')}
          >
            <School size={15} /> Seminar Halls
          </button>
        </div>
      </div>
    </div>
  );
};

