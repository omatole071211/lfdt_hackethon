import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Monitor,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import type { DayOfWeek, OccupiedReservation, RoomStatusResult, ScheduleSlot } from '../../types';
import { formatTime12h } from '../../utils/timeHelpers';

interface RoomDetailDrawerProps {
  statusResult: RoomStatusResult | null;
  schedules: ScheduleSlot[];
  activeDay: DayOfWeek;
  onClose: () => void;
  onOpenWeekly: (statusResult: RoomStatusResult) => void;
  onOccupyRoom?: (statusResult: RoomStatusResult) => void;
  onVacateRoom?: (reservation: OccupiedReservation) => void;
}

export const RoomDetailDrawer: React.FC<RoomDetailDrawerProps> = ({
  statusResult,
  schedules,
  activeDay,
  onClose,
  onOpenWeekly,
  onOccupyRoom,
  onVacateRoom,
}) => {
  if (!statusResult) return null;

  const { room, isAvailable, freeUntil, availableDurationMins, currentSchedule } = statusResult;

  // Filter all schedule entries for this room on activeDay
  const todaySchedules = schedules
    .filter((s) => s.roomId === room.id && s.dayOfWeek === activeDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div>
            <span className="drawer-tag">{room.buildingName}</span>
            <h2 className="drawer-title">{room.name} ({room.code})</h2>
            <p className="drawer-sub">
              {room.departmentName || (room.floor === 0 ? 'Ground Floor' : `Floor ${room.floor}`)} • {room.type.replace('_', ' ').toUpperCase()}
            </p>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Status Highlight Banner */}
        <div className={`drawer-status-banner ${isAvailable ? 'banner-available' : statusResult.isFacultyOccupied ? 'banner-occupied' : 'banner-occupied'}`}>
          {isAvailable ? (
            <div className="banner-flex-content">
              <div className="banner-left">
                <CheckCircle2 size={24} />
                <div>
                  <h4>Currently Available</h4>
                  <p>
                    Free until {formatTime12h(freeUntil || '17:30')} ({Math.floor((availableDurationMins || 0) / 60)}h{' '}
                    {(availableDurationMins || 0) % 60}m free)
                  </p>
                </div>
              </div>
              {onOccupyRoom && (
                <button
                  className="btn btn-sm btn-occupy-banner"
                  onClick={() => {
                    onClose();
                    onOccupyRoom(statusResult);
                  }}
                >
                  🔒 Occupy Class Now
                </button>
              )}
            </div>
          ) : (
            <div className="banner-flex-content">
              <div className="banner-left">
                <XCircle size={24} />
                <div>
                  <h4>{statusResult.isFacultyOccupied ? 'Faculty Ad-hoc Reservation' : 'Currently Occupied'}</h4>
                  <p>
                    {currentSchedule?.subjectCode} - {currentSchedule?.subjectName} (until{' '}
                    {formatTime12h(currentSchedule?.endTime || '')})
                  </p>
                </div>
              </div>
              {statusResult.isFacultyOccupied && statusResult.activeReservation && onVacateRoom && (
                <button
                  className="btn btn-sm btn-vacate-banner"
                  onClick={() => {
                    onClose();
                    onVacateRoom(statusResult.activeReservation!);
                  }}
                >
                  🔓 Vacate Room
                </button>
              )}
            </div>
          )}
        </div>

        {/* Specifications Grid */}
        <div className="drawer-section">
          <h3 className="section-title">Department & Space Specifications</h3>
          <div className="specs-grid">
            <div className="spec-card">
              <GraduationCap size={20} className="spec-icon" />
              <div>
                <span className="spec-label">Department</span>
                <span className="spec-value">{room.departmentName || 'Academic Department'}</span>
              </div>
            </div>

            <div className="spec-card">
              <Monitor size={20} className="spec-icon" />
              <div>
                <span className="spec-label">Desktop Computers</span>
                <span className="spec-value">
                  {room.amenities.computerCount ? `${room.amenities.computerCount} PCs` : 'None'}
                </span>
              </div>
            </div>

            <div className="spec-card">
              <Zap size={20} className="spec-icon" />
              <div>
                <span className="spec-label">Power Outlets</span>
                <span className="spec-value">
                  {room.amenities.powerOutlets ? 'Available per Desk' : 'Wall Outlets'}
                </span>
              </div>
            </div>

            <div className="spec-card">
              <GraduationCap size={20} className="spec-icon" />
              <div>
                <span className="spec-label">Primary Room Type</span>
                <span className="spec-value">{room.type.replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Full Schedule */}
        <div className="drawer-section">
          <div className="section-header-flex">
            <h3 className="section-title">
              <Clock size={16} /> Schedule for {activeDay}
            </h3>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => {
                onClose();
                onOpenWeekly(statusResult);
              }}
            >
              <Calendar size={14} /> Full Week Timetable
            </button>
          </div>

          {todaySchedules.length > 0 ? (
            <div className="schedule-timeline">
              {todaySchedules.map((slot) => (
                <div key={slot.id} className="timeline-item">
                  <div className="timeline-time">
                    <span>{formatTime12h(slot.startTime)}</span>
                    <span className="time-sep">to</span>
                    <span>{formatTime12h(slot.endTime)}</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-subject">
                      <span className="code">{slot.subjectCode}</span>
                      <span className="name">{slot.subjectName}</span>
                    </div>
                    <div className="timeline-meta">
                      <span>👨‍🏫 {slot.facultyName}</span>
                      <span className="batch-tag">{slot.batch}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="timeline-empty">
              <CheckCircle2 size={32} className="text-green" />
              <p>No classes scheduled for {room.name} on {activeDay}. Room is completely free!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
