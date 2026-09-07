import React from 'react';
import { Building2, Clock, Moon, Sun } from 'lucide-react';
import type { LiveTimeState } from '../../hooks/useLiveTime';
import { formatTime12h } from '../../utils/timeHelpers';

interface HeaderProps {
  liveTime: LiveTimeState;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isLiveMode: boolean;
  onResetLive: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  liveTime,
  isDarkMode,
  onToggleTheme,
  isLiveMode,
  onResetLive,
}) => {
  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand Logo & Title */}
        <div className="brand-box">
          <div className="brand-icon">
            <Building2 className="icon-pulse" size={28} />
          </div>
          <div>
            <div className="brand-title">
              CampusSpace <span className="brand-badge">RoomRadar</span>
            </div>
            <p className="brand-sub">Real-Time Classroom & Lab Availability Finder</p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Live Clock Badge */}
          <div
            className={`live-clock-badge ${isLiveMode ? 'active' : 'custom-time'}`}
            onClick={onResetLive}
            title={isLiveMode ? 'Click to re-sync live time' : 'Currently in custom time mode. Click to switch to Live'}
          >
            <Clock size={16} className={isLiveMode ? 'icon-pulse' : ''} />
            <div className="clock-info">
              <span className="clock-time">{formatTime12h(liveTime.time24h)}</span>
              <span className="clock-day">{liveTime.dayOfWeek}</span>
            </div>
            {isLiveMode ? (
              <span className="live-indicator" title="Live Clock Syncing">LIVE</span>
            ) : (
              <span className="custom-indicator">CUSTOM</span>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            className="btn btn-theme"
            onClick={onToggleTheme}
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};
