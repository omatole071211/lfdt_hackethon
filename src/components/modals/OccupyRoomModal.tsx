import React, { useState } from 'react';
import { AlertCircle, Clock, GraduationCap, Lock, User, Users, X } from 'lucide-react';
import type { DayOfWeek, OccupiedReservation, RoomStatusResult } from '../../types';
import { formatDuration, formatTime12h, timeToMinutes, minutesToTime } from '../../utils/timeHelpers';

interface OccupyRoomModalProps {
  statusResult: RoomStatusResult;
  activeDay: DayOfWeek;
  activeTime: string;
  onClose: () => void;
  onOccupy: (reservation: OccupiedReservation) => void;
}

export const OccupyRoomModal: React.FC<OccupyRoomModalProps> = ({
  statusResult,
  activeDay,
  activeTime,
  onClose,
  onOccupy,
}) => {
  const { room, freeUntil, availableDurationMins = 60 } = statusResult;

  const [facultyName, setFacultyName] = useState('Faculty Instructor');
  const [subjectName, setSubjectName] = useState('Extra Class / Study Session');
  const [batch, setBatch] = useState('General Batch');

  // Default duration options in minutes based on max available
  const maxMins = availableDurationMins && availableDurationMins > 0 ? availableDurationMins : 120;
  
  // Calculate potential durations: 15, 30, 45, 60, max
  const durationOptions: { label: string; valueMins: number }[] = [];
  if (maxMins >= 15) durationOptions.push({ label: '15 Mins', valueMins: 15 });
  if (maxMins >= 30) durationOptions.push({ label: '30 Mins', valueMins: 30 });
  if (maxMins >= 45) durationOptions.push({ label: '45 Mins', valueMins: 45 });
  if (maxMins >= 60) durationOptions.push({ label: '1 Hour (60 mins)', valueMins: 60 });
  if (maxMins >= 90) durationOptions.push({ label: '1h 30m', valueMins: 90 });
  if (maxMins >= 120) durationOptions.push({ label: '2 Hours', valueMins: 120 });
  
  // Always include full remaining window option if freeUntil exists
  if (freeUntil && maxMins > 0) {
    const fullLabel = `Until next slot at ${formatTime12h(freeUntil)} (${formatDuration(maxMins)})`;
    if (!durationOptions.some((opt) => opt.valueMins === maxMins)) {
      durationOptions.push({ label: fullLabel, valueMins: maxMins });
    }
  }

  const [selectedMins, setSelectedMins] = useState<number>(() => {
    if (durationOptions.length > 0) {
      const opt60 = durationOptions.find((o) => o.valueMins === 60);
      return opt60 ? 60 : durationOptions[durationOptions.length - 1].valueMins;
    }
    return Math.max(15, Math.min(60, maxMins));
  });

  const calculatedEndMins = timeToMinutes(activeTime) + (selectedMins || 30);
  const calculatedEndTime = minutesToTime(calculatedEndMins);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalFaculty = facultyName.trim() || 'Faculty Instructor';
    const finalSubject = subjectName.trim() || 'Extra Class / Study Session';
    const finalBatch = batch.trim() || 'General Batch';

    const newReservation: OccupiedReservation = {
      id: `res-${crypto.randomUUID()}`,
      roomId: room.id,
      dayOfWeek: activeDay,
      startTime: activeTime,
      endTime: calculatedEndTime,
      facultyName: finalFaculty,
      subjectName: finalSubject,
      batch: finalBatch,
      purpose: 'Faculty Ad-hoc Occupation',
      createdAt: new Date().toISOString(),
    };

    onOccupy(newReservation);
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="modal-container occupy-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="header-title-box">
            <Lock className="modal-title-icon text-amber" size={24} />
            <div>
              <h3>Occupy Free Class / Lab</h3>
              <p className="modal-sub">
                {room.name} — {room.buildingName} (Floor {room.floor === 0 ? 'Ground' : room.floor})
              </p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Free Window Warning Banner */}
        <div className="occupy-warning-banner">
          <AlertCircle size={20} className="icon-amber" />
          <div>
            <strong>Available Window Constraint:</strong>
            <p>
              This room is free for <strong>{formatDuration(maxMins)}</strong> (from {formatTime12h(activeTime)}
              {freeUntil ? ` until ${formatTime12h(freeUntil)}` : ''}).
              Occupancy will automatically end when the next scheduled session begins.
            </p>
          </div>
        </div>

        {/* Occupation Form */}
        <form onSubmit={handleSubmit} className="occupy-form">
          <div className="form-group">
            <label className="form-label">
              <User size={15} /> Faculty / Teacher Name *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dr. A. Sharma / Prof. M. Nukulwar"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                <GraduationCap size={15} /> Subject / Purpose *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Remedial Class / Lab Session"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Users size={15} /> Batch / Division
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. TE IT Div A / All Batches"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
              />
            </div>
          </div>

          {/* Time & Duration Picker */}
          <div className="form-group">
            <label className="form-label">
              <Clock size={15} /> Select Occupation Duration (Max {formatDuration(maxMins)})
            </label>
            <div className="duration-options-grid">
              {durationOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.valueMins}
                  className={`duration-chip ${selectedMins === opt.valueMins ? 'active' : ''}`}
                  onClick={() => setSelectedMins(opt.valueMins)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Box */}
          <div className="occupy-summary-card">
            <div className="summary-row">
              <span>Day & Start Time:</span>
              <strong>{activeDay}, {formatTime12h(activeTime)}</strong>
            </div>
            <div className="summary-row">
              <span>Occupied End Time:</span>
              <strong className="text-amber">{formatTime12h(calculatedEndTime)} ({selectedMins} mins duration)</strong>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              🔒 Confirm Occupy Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
