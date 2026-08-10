import React, { useState } from 'react';
import { Users, Search, Hash, Database, ShieldCheck, Circle } from 'lucide-react';

export default function Sidebar({ onlineUsers, currentUser, isOpen, messageCount }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = onlineUsers.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className={`glass-panel sidebar-container ${isOpen ? 'open' : ''}`} style={{
      width: '280px',
      flexShrink: 0,
      borderRight: '1px solid var(--border-glass)',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 64px)',
      transition: 'transform 0.3s ease'
    }}>
      {/* Channel Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-glass)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-main)',
          fontSize: '1rem',
          fontWeight: '700',
          fontFamily: 'var(--font-heading)',
          marginBottom: '4px'
        }}>
          <Hash size={18} color="var(--accent-primary)" />
          <span>general-lounge</span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Public real-time room for everyone
        </p>
      </div>

      {/* User Search Input */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-glass)' }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search online users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '10px',
              backgroundColor: 'var(--input-bg)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-main)',
              fontSize: '0.82rem'
            }}
          />
        </div>
      </div>

      {/* Active Online Users List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          padding: '0 4px'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            Active Users ({onlineUsers.length})
          </span>
        </div>

        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No users match search
          </div>
        ) : (
          filteredUsers.map((u) => {
            const isMe = currentUser && u.username === currentUser.username;
            return (
              <div
                key={u.socketId || u.username}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '14px',
                  backgroundColor: isMe ? 'var(--my-user-card-bg)' : 'transparent',
                  border: isMe ? '1px solid var(--border-glow)' : '1px solid transparent',
                  marginBottom: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div className="avatar-ring" style={{ width: '34px', height: '34px', fontSize: '1.1rem' }}>
                    {u.avatar || '👤'}
                  </div>
                  <span style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    border: '2px solid var(--bg-glass-card)'
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '0.88rem',
                      fontWeight: isMe ? '700' : '500',
                      color: isMe ? 'var(--accent-primary)' : 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {u.username}
                    </span>
                    {isMe && (
                      <span style={{
                        fontSize: '0.65rem',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--accent-primary)',
                        color: '#ffffff',
                        fontWeight: '700'
                      }}>
                        YOU
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Online</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer System Info */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid var(--border-glass)',
        fontSize: '0.75rem',
        color: 'var(--text-dim)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={13} color="var(--accent-primary)" />
          <span>SQLite Database Persistence</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={13} color="#10b981" />
          <span>{messageCount} total messages stored</span>
        </div>
      </div>
    </aside>
  );
}
