import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  FlaskConical,
  GraduationCap,
  Info,
  Monitor,
  School,
  XCircle,
  Zap,
} from 'lucide-react';
import type { RoomStatusResult, RoomType } from '../../types';
import { formatDuration, formatTime12h } from '../../utils/timeHelpers';

interface RoomCardProps {
  statusResult: RoomStatusResult;
  onOpenDetail: (roomStatus: RoomStatusResult) => void;
  onOpenWeekly: (roomStatus: RoomStatusResult) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  statusResult,
  onOpenDetail,
  onOpenWeekly,
}) => {
  const { room, isAvailable, currentSchedule, nextSchedule, freeUntil, availableDurationMins } =
    statusResult;

  // Helper icon for Room Type
  const renderRoomTypeBadge = (type: RoomType) => {
    switch (type) {
      case 'classroom':
        return (
          <span className="type-badge type-classroom">
            <GraduationCap size={13} /> Classroom
          </span>
        );
      case 'computer_lab':
        return (
          <span className="type-badge type-computer-lab">
            <Monitor size={13} /> Computer Lab
          </span>
        );
      case 'science_lab':
        return (
          <span className="type-badge type-science-lab">
            <FlaskConical size={13} /> Laboratory
          </span>
        );
      case 'seminar_hall':
        return (
          <span className="type-badge type-seminar-hall">
            <School size={13} /> Seminar Hall
          </span>
        );
    }
  };

  return (
    <div className={`room-card ${isAvailable ? 'card-available' : 'card-occupied'}`}>
      {/* Top Banner Status */}
      <div className="card-header">
        <div className="status-indicator">
          {status.isHoliday ? (
            <>
              <Calendar size={18} className="icon-amber" />
              <span className="status-text text-amber">HOLIDAY (CLOSED)</span>
            </>
          ) : isAvailable ? (
            <>
              <CheckCircle2 size={18} className="icon-green" />
              <span className="status-text text-green">AVAILABLE NOW</span>
            </>
          ) : (
            <>
              <XCircle size={18} className="icon-red" />
              <span className="status-text text-red">OCCUPIED</span>
            </>
          )}
        </div>

        {renderRoomTypeBadge(room.type)}
      </div>

      {/* Main Room Specs */}
      <div className="card-body">
        <div className="room-title-row">
          <div>
            <h3 className="room-name">{room.name}</h3>
            <div className="room-location">
              <span>{room.buildingName}</span>
              <span className="dot-divider">•</span>
              <span className="floor-label">
                {room.departmentName || (room.floor === 0 ? 'Ground Floor' : `Floor ${room.floor}`)}
              </span>
            </div>
          </div>
          <span className="room-code-tag">{room.code}</span>
        </div>

        {/* Equipment & Sockets Pills */}
        <div className="amenities-row">
          {room.amenities.computerCount ? (
            <div className="amenity-pill highlight" title="Desktop Computers Available">
              <Monitor size={14} />
              <span>{room.amenities.computerCount} PCs</span>
            </div>
          ) : null}

          {room.amenities.powerOutlets && (
            <div className="amenity-pill" title="Power Sockets Available">
              <Zap size={14} />
              <span>Power Outlets</span>
            </div>
          )}
        </div>

        {/* Dynamic Class Status Information Box */}
        {status.isHoliday ? (
          <div className="status-box box-holiday">
            <div className="status-box-header">
              <Calendar size={16} className="text-amber" />
              <span className="box-title">Weekend Campus Holiday</span>
            </div>
            <p className="box-highlight text-amber">
              No Academic Classes Scheduled
            </p>
            <p className="box-sub">
              Campus is on weekend holiday (Saturday & Sunday)
            </p>
          </div>
        ) : isAvailable ? (
          <div className="status-box box-free">
            <div className="status-box-header">
              <Clock size={16} className="text-green" />
              <span className="box-title">Free Duration Window</span>
            </div>
            <p className="box-highlight text-green">
              Free until {formatTime12h(freeUntil || '17:30')}
            </p>
            <p className="box-sub">
              Uninterrupted for{' '}
              <strong>{formatDuration(availableDurationMins || 0)}</strong>
            </p>
            {nextSchedule && (
              <div className="next-slot-reminder">
                Next class: {nextSchedule.subjectCode} ({formatTime12h(nextSchedule.startTime)})
              </div>
            )}
          </div>
        ) : (
          <div className="status-box box-busy">
            <div className="status-box-header">
              <Clock size={16} className="text-red" />
              <span className="box-title">Current Scheduled Session</span>
            </div>

            {currentSchedule && (
              <div className="class-details">
                <div className="subject-line">
                  <span className="subject-code">{currentSchedule.subjectCode}</span>
                  <span className="subject-name">{currentSchedule.subjectName}</span>
                </div>
                <div className="faculty-batch">
                  <span>👨‍🏫 {currentSchedule.facultyName}</span>
                  <span className="batch-badge">{currentSchedule.batch}</span>
                </div>
                <div className="session-timer">
                  <span>
                    ⏰ {formatTime12h(currentSchedule.startTime)} – {formatTime12h(currentSchedule.endTime)}
                  </span>
                  <span className="next-free-tag">
                    Free at {formatTime12h(currentSchedule.endTime)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="card-footer">
        <button className="btn-card-action" onClick={() => onOpenWeekly(statusResult)}>
          <Calendar size={15} />
          <span>Weekly Schedule</span>
        </button>
        <button className="btn-card-action primary" onClick={() => onOpenDetail(statusResult)}>
          <Info size={15} />
          <span>Room Specs</span>
        </button>
      </div>
    </div>
  );
};
