import React, { useState } from 'react';
import {
  Award,
  Building as BuildingIcon,
  CheckCircle2,
  Clock,
  Laptop,
  Lightbulb,
  Monitor,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react';
import type {
  Building,
  DayOfWeek,
  GroupSize,
  RecommendationQuery,
  RecommendationResult,
  Room,
  RoomStatusResult,
  ScheduleSlot,
} from '../../types';
import { formatDuration, formatTime12h } from '../../utils/timeHelpers';
import { recommendRooms } from '../../utils/timetableEngine';

interface RecommendationModalProps {
  rooms: Room[];
  buildings: Building[];
  schedules: ScheduleSlot[];
  activeDay: DayOfWeek;
  activeTime: string;
  onClose: () => void;
  onSelectRoom: (statusResult: RoomStatusResult) => void;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  rooms,
  buildings,
  schedules,
  activeDay,
  activeTime,
  onClose,
  onSelectRoom,
}) => {
  const [query, setQuery] = useState<RecommendationQuery>({
    purpose: 'classroom',
    groupSize: 'small',
    buildingId: 'all',
    needComputers: false,
    needProjector: false,
  });

  const [results, setResults] = useState<RecommendationResult[] | null>(null);

  const handleGenerate = () => {
    const recs = recommendRooms(rooms, schedules, query, activeDay, activeTime);
    setResults(recs);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-title-box">
            <Sparkles size={24} className="text-magic" />
            <div>
              <h2>Smart Free-Room Recommendation Wizard</h2>
              <p>Find the best uninterrupted free space for your current requirement</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Wizard Form */}
        <div className="wizard-form">
          {/* Step 1: Purpose */}
          <div className="form-group">
            <label className="form-label">
              <Lightbulb size={16} /> What room type do you need?
            </label>
            <div className="choice-grid">
              <button
                className={`choice-card ${query.purpose === 'classroom' ? 'selected' : ''}`}
                onClick={() => setQuery({ ...query, purpose: 'classroom' })}
              >
                <User size={20} />
                <span>Classroom</span>
              </button>
              <button
                className={`choice-card ${query.purpose === 'lab' ? 'selected' : ''}`}
                onClick={() => setQuery({ ...query, purpose: 'lab', needComputers: true })}
              >
                <Laptop size={20} />
                <span>Computer Lab</span>
              </button>
              <button
                className={`choice-card ${query.purpose === 'seminar_hall' ? 'selected' : ''}`}
                onClick={() => setQuery({ ...query, purpose: 'seminar_hall', needProjector: true })}
              >
                <Users size={20} />
                <span>Seminar / Presentation Hall</span>
              </button>
            </div>
          </div>

          {/* Step 2: Group Size & Building */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                <Users size={16} /> Group Size
              </label>
              <select
                className="filter-select"
                value={query.groupSize}
                onChange={(e) => setQuery({ ...query, groupSize: e.target.value as GroupSize })}
              >
                <option value="small">Small Group (2–5 People)</option>
                <option value="large">Large Group (More than 10 People)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <BuildingIcon size={16} /> Building Block Preference
              </label>
              <select
                className="filter-select"
                value={query.buildingId}
                onChange={(e) => setQuery({ ...query, buildingId: e.target.value })}
              >
                <option value="all">Any Campus Building</option>
                {buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 3: Equipment Toggles */}
          <div className="form-group">
            <label className="form-label">Equipment Needed</label>
            <div className="toggles-row">
              <label className="checkbox-pill">
                <input
                  type="checkbox"
                  checked={!!query.needComputers}
                  onChange={(e) => setQuery({ ...query, needComputers: e.target.checked })}
                />
                <Monitor size={16} />
                <span>Desktop PCs Required</span>
              </label>
            </div>
          </div>

          <button className="btn btn-wizard-submit" onClick={handleGenerate}>
            <Sparkles size={18} />
            <span>Generate Top Recommendations</span>
          </button>
        </div>

        {/* Results Display */}
        {results && (
          <div className="results-section">
            <h3 className="results-title">
              <Award size={18} className="text-magic" /> Top Recommended Free Rooms ({results.length} available)
            </h3>

            {results.length > 0 ? (
              <div className="recs-list">
                {results.slice(0, 3).map((rec, index) => (
                  <div key={rec.roomStatus.room.id} className="rec-card">
                    <div className="rec-badge">#{index + 1} Recommendation</div>
                    <div className="rec-content">
                      <div className="rec-header">
                        <h4>{rec.roomStatus.room.name} ({rec.roomStatus.room.code})</h4>
                        <span className="score-tag">Match Score: {rec.score} pts</span>
                      </div>
                      <p className="rec-location">
                        {rec.roomStatus.room.buildingName} • {rec.roomStatus.room.departmentName || `Floor ${rec.roomStatus.room.floor}`}
                      </p>

                      <div className="rec-duration text-green">
                        <Clock size={15} /> Free until {formatTime12h(rec.roomStatus.freeUntil || '')} (
                        {formatDuration(rec.roomStatus.availableDurationMins || 0)} free)
                      </div>

                      <div className="match-reasons">
                        {rec.matchReasons.map((reason, i) => (
                          <span key={i} className="reason-pill">
                            <CheckCircle2 size={12} /> {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        onClose();
                        onSelectRoom(rec.roomStatus);
                      }}
                    >
                      Inspect Room
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No available rooms currently fit all your strict criteria. Try expanding building or equipment choices.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
