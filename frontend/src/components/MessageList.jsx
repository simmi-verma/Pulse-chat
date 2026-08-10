import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { MessageSquareDashed } from 'lucide-react';

export default function MessageList({ messages, currentUser, isLoading }) {
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper to format date header string
  const formatDateLabel = (isoString) => {
    try {
      const date = new Date(isoString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) return 'Today';
      if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  // Group messages by Date
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateLabel = formatDateLabel(msg.timestamp);
    if (!acc[dateLabel]) acc[dateLabel] = [];
    acc[dateLabel].push(msg);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        color: 'var(--text-muted)'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: 'var(--accent-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{ fontSize: '0.9rem' }}>Loading persisted messages...</span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {messages.length === 0 ? (
        <div style={{
          margin: 'auto',
          textAlign: 'center',
          color: 'var(--text-muted)',
          maxWidth: '320px'
        }}>
          <MessageSquareDashed size={48} style={{ opacity: 0.4, marginBottom: '12px', color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
            No Messages Yet
          </h3>
          <p style={{ fontSize: '0.85rem' }}>
            Be the first to say hello in real-time! Type your message below.
          </p>
        </div>
      ) : (
        Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
          <div key={dateLabel}>
            {/* Date Badge Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '16px 0 10px 0'
            }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: '600',
                padding: '4px 12px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-muted)'
              }}>
                {dateLabel}
              </span>
            </div>

            {/* Messages in this Date */}
            {msgs.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwnMessage={currentUser && msg.sender === currentUser.username}
              />
            ))}
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
}
