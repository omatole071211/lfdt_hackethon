import React from 'react';
import { CheckCircle2, GraduationCap, Monitor, XCircle } from 'lucide-react';

interface AnalyticsBannerProps {
  statistics: {
    total: number;
    available: number;
    occupied: number;
    totalClassrooms: number;
    filteredClassrooms: number;
    totalLabs: number;
    filteredLabs: number;
  };
}

export const AnalyticsBanner: React.FC<AnalyticsBannerProps> = ({ statistics }) => {
  return (
    <section className="analytics-banner">
      <div className="analytics-grid">
        {/* Classroom Count (Accurate Before & After Sort/Filter) */}
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

        {/* Labs Count (Accurate Before & After Sort/Filter) */}
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

        {/* Available Spaces */}
        <div className="stat-card stat-available">
          <div className="stat-icon-wrapper">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statistics.available}</span>
            <span className="stat-label">Available Spaces</span>
          </div>
          <span className="stat-badge badge-green">FREE</span>
        </div>

        {/* Occupied Classes */}
        <div className="stat-card stat-occupied">
          <div className="stat-icon-wrapper">
            <XCircle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statistics.occupied}</span>
            <span className="stat-label">Occupied Classes</span>
          </div>
          <span className="stat-badge badge-red">OCCUPIED</span>
        </div>
      </div>
    </section>
  );
};

