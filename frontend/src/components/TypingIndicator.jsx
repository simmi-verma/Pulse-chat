import React from 'react';

export default function TypingIndicator({ typingUsers }) {
  if (!typingUsers || typingUsers.length === 0) return null;

  const text = typingUsers.length === 1
    ? `${typingUsers[0]} is typing...`
    : `${typingUsers.join(', ')} are typing...`;

  return (
    <div
      className="animate-fade-in"
      style={{
        padding: '6px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}
    >
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '12px',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid var(--border-glow)'
      }}>
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
      <span>{text}</span>
    </div>
  );
}
