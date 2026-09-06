import React from 'react';
import { Calendar, X } from 'lucide-react';
import type { DayOfWeek, RoomStatusResult, ScheduleSlot } from '../../types';
import { formatTime12h, timeToMinutes } from '../../utils/timeHelpers';

interface WeeklyTimetableModalProps {
  statusResult: RoomStatusResult | null;
  schedules: ScheduleSlot[];
  onClose: () => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TIME_SLOTS = [
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '11:00', end: '12:00' },
  { start: '12:00', end: '13:00' },
  { start: '13:00', end: '14:00' },
  { start: '14:00', end: '15:00' },
  { start: '15:00', end: '16:00' },
  { start: '16:00', end: '17:00' },
];

export const WeeklyTimetableModal: React.FC<WeeklyTimetableModalProps> = ({
  statusResult,
  schedules,
  onClose,
}) => {
  if (!statusResult) return null;

  const { room } = statusResult;

  // Function to find schedule matching a specific day and time slot
  const findMatchingSlot = (day: DayOfWeek, slotStart: string, slotEnd: string) => {
    const startMins = timeToMinutes(slotStart);
    const endMins = timeToMinutes(slotEnd);

    return schedules.find((s) => {
      if (s.roomId !== room.id || s.dayOfWeek !== day) return false;
      const sStart = timeToMinutes(s.startTime);
      const sEnd = timeToMinutes(s.endTime);
      // Check for overlap
      return Math.max(startMins, sStart) < Math.min(endMins, sEnd);
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-wide" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="header-title-box">
            <Calendar size={22} className="text-primary" />
            <div>
              <h2>Master Weekly Schedule Matrix</h2>
              <p>
                {room.name} ({room.code}) • {room.buildingName} • Floor {room.floor}
              </p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Legend */}
        <div className="matrix-legend">
          <div className="legend-item">
            <span className="legend-box box-free"></span>
            <span>Free / Available Slot</span>
          </div>
          <div className="legend-item">
            <span className="legend-box box-class"></span>
            <span>Lecture / Theory Class</span>
          </div>
          <div className="legend-item">
            <span className="legend-box box-lab"></span>
            <span>Lab / Practical Session</span>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="matrix-wrapper">
          <table className="matrix-table">
            <thead>
              <tr>
                <th className="col-time">Time Slot</th>
                {DAYS.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot) => (
                <tr key={slot.start}>
                  <td className="cell-time">
                    {formatTime12h(slot.start)} - {formatTime12h(slot.end)}
                  </td>
                  {DAYS.map((day) => {
                    const match = findMatchingSlot(day, slot.start, slot.end);
                    const isLab = match?.subjectCode.endsWith('P') || match?.subjectName.toLowerCase().includes('lab');

                    return (
                      <td
                        key={day}
                        className={`matrix-cell ${
                          match ? (isLab ? 'cell-lab' : 'cell-occupied') : 'cell-free'
                        }`}
                      >
                        {match ? (
                          <div className="cell-content">
                            <span className="cell-code">{match.subjectCode}</span>
                            <span className="cell-name">{match.subjectName}</span>
                            <span className="cell-meta">👨‍🏫 {match.facultyName}</span>
                            <span className="cell-batch">{match.batch}</span>
                          </div>
                        ) : (
                          <span className="cell-free-tag">FREE</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
