import React from 'react';
import { Radio, Users, Sun, Moon, LogOut, RefreshCw, MessageSquare } from 'lucide-react';

export default function Header({
  currentUser,
  isConnected,
  onlineCount,
  theme,
  onToggleTheme,
  onSwitchUser,
  onRefresh,
  onToggleSidebar,
  sidebarOpen
}) {
  return (
    <header className="glass-panel" style={{
      height: '64px',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-glass)',
      position: 'relative',
      zIndex: 20
    }}>
      {/* Left: Brand & Mobile Sidebar Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          className="mobile-sidebar-toggle"
          style={{
            padding: '8px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-glass)',
            display: 'none' // Controlled by CSS media query
          }}
          title="Toggle Users Sidebar"
        >
          <Users size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--accent-glow)'
          }}>
            <MessageSquare size={20} color="#ffffff" />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.15rem',
              fontWeight: '700',
              fontFamily: 'var(--font-heading)',
              lineHeight: '1.2'
            }}>
              Pulse Chat
            </h1>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Real-Time Socket.io
            </span>
          </div>
        </div>

        {/* Live Socket Connection Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '999px',
          backgroundColor: isConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
          border: isConnected ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: isConnected ? '#10b981' : '#f59e0b',
          marginLeft: '8px'
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: isConnected ? '#10b981' : '#f59e0b',
            boxShadow: isConnected ? '0 0 8px #10b981' : 'none'
          }} />
          {isConnected ? 'Live Socket.io' : 'Connecting...'}
        </div>
      </div>

      {/* Right Controls & Current User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Online Count Badge */}
        <div className="icon-badge" style={{ padding: '6px 12px', gap: '6px', fontSize: '0.82rem' }}>
          <Users size={14} color="var(--accent-primary)" />
          <span>{onlineCount} Online</span>
        </div>

        {/* Refresh History Button */}
        <button
          onClick={onRefresh}
          className="icon-badge"
          style={{ width: '36px', height: '36px' }}
          title="Refresh Message History"
        >
          <RefreshCw size={16} />
        </button>

        {/* Theme Switcher */}
        <button
          onClick={onToggleTheme}
          className="icon-badge"
          style={{ width: '36px', height: '36px' }}
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User Pill */}
        {currentUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 6px 4px 10px',
            borderRadius: '999px',
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid var(--border-glow)'
          }}>
            <span style={{ fontSize: '1rem' }}>{currentUser.avatar}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
              {currentUser.username}
            </span>
            <button
              onClick={onSwitchUser}
              style={{
                padding: '4px 8px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--text-muted)',
                fontSize: '0.7rem'
              }}
              title="Change Username"
            >
              <LogOut size={12} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
