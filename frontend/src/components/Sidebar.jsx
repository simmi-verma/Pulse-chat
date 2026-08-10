import React, { useState } from 'react';
import { Users, Search, Hash, Plus, MessageSquarePlus, Database, ShieldCheck } from 'lucide-react';

export default function Sidebar({ onlineUsers, currentUser, isOpen, messageCount, activeRoom, onSwitchRoom }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customRooms, setCustomRooms] = useState(['general-lounge', 'tech-talk', 'project-ideas']);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const filteredUsers = onlineUsers.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRoomSubmit = (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const formattedName = newRoomName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!customRooms.includes(formattedName)) {
      setCustomRooms((prev) => [...prev, formattedName]);
    }
    onSwitchRoom(formattedName);
    setNewRoomName('');
    setIsCreatingRoom(false);
  };

  const handleStartDirectChat = (user) => {
    if (user.username === currentUser?.username) return;
    const dmRoom = `dm-${[currentUser?.username, user.username].sort().join('-')}`;
    if (!customRooms.includes(dmRoom)) {
      setCustomRooms((prev) => [...prev, dmRoom]);
    }
    onSwitchRoom(dmRoom);
  };

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
      {/* Active Room Title */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-glass)' }}>
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
          <span>{activeRoom || 'general-lounge'}</span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {(activeRoom || 'general-lounge').startsWith('dm-') ? 'Direct 1-on-1 Chat' : 'Public real-time room'}
        </p>
      </div>

      {/* User Search Input */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-glass)' }}>
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

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {/* Chat Channels Section with + New Chat Button */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
            padding: '0 4px'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              Chat Rooms ({customRooms.length})
            </span>
            <button
              onClick={() => setIsCreatingRoom(!isCreatingRoom)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: '8px',
                backgroundColor: 'var(--btn-bg)',
                border: '1px solid var(--border-glass)',
                color: 'var(--accent-primary)',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}
              title="Create New Chat Room"
            >
              <Plus size={12} />
              <span>New</span>
            </button>
          </div>

          {/* New Room Input Field */}
          {isCreatingRoom && (
            <form onSubmit={handleCreateRoomSubmit} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="e.g. design-lounge"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--input-bg)',
                    border: '1px solid var(--border-glow)',
                    fontSize: '0.8rem',
                    color: 'var(--text-main)'
                  }}
                  autoFocus
                />
                <button
                  type="submit"
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    background: 'var(--accent-gradient)',
                    color: '#fff',
                    fontSize: '0.78rem',
                    fontWeight: '600'
                  }}
                >
                  Create
                </button>
              </div>
            </form>
          )}

          {/* Rooms List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {customRooms.map((room) => {
              const isActive = activeRoom === room;
              return (
                <button
                  key={room}
                  onClick={() => onSwitchRoom(room)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? 'var(--my-user-card-bg)' : 'transparent',
                    border: isActive ? '1px solid var(--border-glow)' : '1px solid transparent',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '0.86rem',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Hash size={15} color={isActive ? 'var(--accent-primary)' : 'var(--text-dim)'} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{room}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Online Users List (Click to Start Direct Chat) */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
            padding: '0 4px'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              Online Users ({onlineUsers.length})
            </span>
          </div>

          {filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No users online
            </div>
          ) : (
            filteredUsers.map((u) => {
              const isMe = currentUser && u.username === currentUser.username;
              return (
                <div
                  key={u.socketId || u.username}
                  onClick={() => !isMe && handleStartDirectChat(u)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    backgroundColor: isMe ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                    cursor: isMe ? 'default' : 'pointer',
                    marginBottom: '4px',
                    transition: 'all 0.15s ease'
                  }}
                  title={!isMe ? `Click to start private chat with ${u.username}` : 'Your profile'}
                >
                  <div style={{ position: 'relative' }}>
                    <div className="avatar-ring" style={{ width: '32px', height: '32px', fontSize: '1.05rem' }}>
                      {u.avatar || '👤'}
                    </div>
                    <span style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      border: '2px solid var(--bg-glass-card)'
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: isMe ? '700' : '500',
                        color: 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {u.username}
                      </span>
                      {isMe && (
                        <span style={{
                          fontSize: '0.62rem',
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
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {!isMe ? '💬 Click to Chat' : 'Online'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
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
          <span>SQLite Room Persistence</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={13} color="#10b981" />
          <span>{messageCount} messages in #{activeRoom}</span>
        </div>
      </div>
    </aside>
  );
}
