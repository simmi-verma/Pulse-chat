import React, { useState } from 'react';
import { User, Sparkles, ArrowRight } from 'lucide-react';

const AVATAR_OPTIONS = ['🚀', '⚡', '💎', '🦊', '🎨', '🐱', '🤖', '🐉', '🌟', '🎮', '🍕', '🔥'];

export default function AuthModal({ onLogin }) {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🚀');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a display username');
      return;
    }
    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters long');
      return;
    }
    onLogin({
      username: username.trim(),
      avatar: selectedAvatar
    });
  };

  const handleQuickJoin = () => {
    const randomAdjectives = ['Swift', 'Cosmic', 'Neon', 'Quantum', 'Pixel', 'Astro'];
    const randomAnimals = ['Fox', 'Panda', 'Tiger', 'Falcon', 'Coder', 'Voyager'];
    const randomName = `${randomAdjectives[Math.floor(Math.random() * randomAdjectives.length)]}${randomAnimals[Math.floor(Math.random() * randomAnimals.length)]}_${Math.floor(Math.random() * 899 + 100)}`;
    const randomAvatar = AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)];

    onLogin({
      username: randomName,
      avatar: randomAvatar
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '440px',
        width: '100%',
        borderRadius: '24px',
        padding: '32px',
        backgroundColor: 'var(--bg-glass-card)',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border-glass)'
      }}>
        {/* Header Icon */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'var(--accent-gradient)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
            marginBottom: '16px'
          }}>
            <Sparkles size={32} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', fontFamily: 'var(--font-heading)', color: 'var(--text-main)', marginBottom: '8px' }}>
            Pulse Chat Real-Time
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Choose a display name & avatar to start chatting instantly over Socket.io
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Avatar Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Choose your Avatar
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '8px',
              backgroundColor: 'var(--input-bg)',
              padding: '10px',
              borderRadius: '16px'
            }}>
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedAvatar(emoji)}
                  style={{
                    fontSize: '1.4rem',
                    padding: '8px',
                    borderRadius: '12px',
                    background: selectedAvatar === emoji ? 'var(--accent-primary)' : 'transparent',
                    border: selectedAvatar === emoji ? '2px solid #ffffff' : '1px solid transparent',
                    transition: 'all 0.2s ease',
                    transform: selectedAvatar === emoji ? 'scale(1.15)' : 'scale(1)'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Username Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Alex_Dev"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--input-bg)',
                  border: error ? '1px solid #ef4444' : '1px solid var(--border-glass)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem'
                }}
                maxLength={20}
                autoFocus
              />
            </div>
            {error && (
              <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px', display: 'block' }}>
                {error}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              background: 'var(--accent-gradient)',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--accent-glow)',
              transition: 'transform 0.2s ease, opacity 0.2s ease',
              marginBottom: '12px'
            }}
          >
            Enter Chat <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={handleQuickJoin}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              border: '1px dashed var(--border-glass)',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            🎲 Auto-generate Guest Profile
          </button>
        </form>
      </div>
    </div>
  );
}
