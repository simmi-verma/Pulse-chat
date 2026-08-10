import React, { useState } from 'react';
import { Check, CheckCheck, Copy, CheckCircle2 } from 'lucide-react';

export default function MessageBubble({ message, isOwnMessage }) {
  const [copied, setCopied] = useState(false);

  const formatTimestamp = (isoString) => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'Just now';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: isOwnMessage ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: '10px',
        margin: '10px 0',
        position: 'relative'
      }}
    >
      {/* Avatar */}
      <div className="avatar-ring">
        {message.sender_avatar || '👤'}
      </div>

      {/* Bubble Container */}
      <div style={{
        maxWidth: '70%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOwnMessage ? 'flex-end' : 'flex-start'
      }}>
        {/* Sender Name (Only for other users) */}
        {!isOwnMessage && (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: 'var(--text-muted)',
            marginBottom: '4px',
            marginLeft: '4px'
          }}>
            {message.sender}
          </span>
        )}

        {/* Message Bubble Card */}
        <div
          className="bubble-card"
          style={{
            padding: '12px 16px',
            borderRadius: isOwnMessage ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
            background: isOwnMessage ? 'var(--user-msg-gradient)' : 'var(--other-msg-bg)',
            color: isOwnMessage ? 'var(--user-msg-text)' : 'var(--other-msg-text)',
            border: isOwnMessage ? '1px solid var(--user-msg-border)' : '1px solid var(--other-msg-border)',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
            wordBreak: 'break-word',
            fontSize: '0.94rem',
            lineHeight: '1.45'
          }}
        >
          <span>{message.text}</span>

          {/* Time & Read Status Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '4px',
            marginTop: '4px',
            fontSize: '0.68rem',
            color: isOwnMessage ? 'var(--user-msg-time)' : 'var(--other-msg-time)'
          }}>
            <span>{formatTimestamp(message.timestamp)}</span>

            {/* Read Ticks for own messages */}
            {isOwnMessage && (
              <span title={message.read_status === 1 ? 'Read by active users' : 'Delivered'}>
                {message.read_status === 1 ? (
                  <CheckCheck size={14} color="var(--accent-primary)" />
                ) : (
                  <Check size={14} color="var(--text-muted)" />
                )}
              </span>
            )}

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                opacity: 0.65,
                padding: '2px',
                marginLeft: '4px'
              }}
              title="Copy message"
            >
              {copied ? <CheckCircle2 size={12} color="#10b981" /> : <Copy size={12} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
