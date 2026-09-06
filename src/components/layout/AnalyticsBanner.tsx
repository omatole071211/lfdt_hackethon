import React from 'react';
import { CheckCircle2, Monitor, School, XCircle } from 'lucide-react';

interface AnalyticsBannerProps {
  statistics: {
    total: number;
    available: number;
    occupied: number;
    freeComputerLabs: number;
    freeSeminarHalls: number;
  };
}

export const AnalyticsBanner: React.FC<AnalyticsBannerProps> = ({ statistics }) => {
  return (
    <section className="analytics-banner">
      <div className="analytics-grid">
        {/* Total Rooms */}
        <div className="stat-card stat-total">
          <div className="stat-icon-wrapper">
            <School size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statistics.total}</span>
            <span className="stat-label">Total Campus Spaces</span>
          </div>
        </div>

        {/* Available Rooms */}
        <div className="stat-card stat-available">
          <div className="stat-icon-wrapper">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statistics.available}</span>
            <span className="stat-label">Available Now</span>
          </div>
          <span className="stat-badge badge-green">FREE</span>
        </div>

        {/* Occupied Rooms */}
        <div className="stat-card stat-occupied">
          <div className="stat-icon-wrapper">
            <XCircle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statistics.occupied}</span>
            <span className="stat-label">Classes Ongoing</span>
          </div>
          <span className="stat-badge badge-red">OCCUPIED</span>
        </div>

        {/* Free Computer Labs */}
        <div className="stat-card stat-labs">
          <div className="stat-icon-wrapper">
            <Monitor size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statistics.freeComputerLabs}</span>
            <span className="stat-label">Free Computer Labs</span>
          </div>
          <span className="stat-badge badge-indigo">LABS</span>
        </div>
      </div>
    </section>
  );
};
