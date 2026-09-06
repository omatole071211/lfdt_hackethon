import React from 'react';
import { Calendar, CheckCircle2, GraduationCap, Monitor, XCircle } from 'lucide-react';

interface AnalyticsBannerProps {
  statistics: {
    total: number;
    available: number;
    occupied: number;
    totalClassrooms: number;
    filteredClassrooms: number;
    totalLabs: number;
    filteredLabs: number;
    isHolidayDay?: boolean;
  };
}

export const AnalyticsBanner: React.FC<AnalyticsBannerProps> = ({ statistics }) => {
  return (
    <section className="analytics-banner">
      <div className="analytics-grid">
        {/* Classroom Count */}
        <div className="stat-card stat-total">
          <div className="stat-icon-wrapper">
            <GraduationCap size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {statistics.filteredClassrooms} <span className="stat-subtext">/ {statistics.totalClassrooms}</span>
            </span>
            <span className="stat-label">Classrooms (Filtered / Total)</span>
          </div>
        </div>

        {/* Labs Count */}
        <div className="stat-card stat-labs">
          <div className="stat-icon-wrapper">
            <Monitor size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {statistics.filteredLabs} <span className="stat-subtext">/ {statistics.totalLabs}</span>
            </span>
            <span className="stat-label">Labs Count (Filtered / Total)</span>
          </div>
          <span className="stat-badge badge-indigo">LABS</span>
        </div>

        {/* Available Spaces / Holiday */}
        <div className="stat-card stat-available">
          <div className="stat-icon-wrapper">
            {statistics.isHolidayDay ? <Calendar size={22} className="text-amber" /> : <CheckCircle2 size={22} />}
          </div>
          <div className="stat-info">
            <span className="stat-value">{statistics.isHolidayDay ? 'Holiday' : statistics.available}</span>
            <span className="stat-label">{statistics.isHolidayDay ? 'Campus Status' : 'Available Spaces'}</span>
          </div>
          <span className={`stat-badge ${statistics.isHolidayDay ? 'badge-amber' : 'badge-green'}`}>
            {statistics.isHolidayDay ? 'CLOSED' : 'FREE'}
          </span>
        </div>

        {/* Occupied Classes / Holiday Note */}
        <div className="stat-card stat-occupied">
          <div className="stat-icon-wrapper">
            {statistics.isHolidayDay ? <Calendar size={22} className="text-amber" /> : <XCircle size={22} />}
          </div>
          <div className="stat-info">
            <span className="stat-value">{statistics.isHolidayDay ? 'No Classes' : statistics.occupied}</span>
            <span className="stat-label">{statistics.isHolidayDay ? 'Weekend Holiday' : 'Occupied Classes'}</span>
          </div>
          <span className={`stat-badge ${statistics.isHolidayDay ? 'badge-amber' : 'badge-red'}`}>
            {statistics.isHolidayDay ? 'HOLIDAY' : 'OCCUPIED'}
          </span>
        </div>
      </div>
    </section>
  );
};

