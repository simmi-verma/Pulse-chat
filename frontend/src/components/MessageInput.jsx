import React, { useState } from 'react';
import { Send, Smile } from 'lucide-react';

const QUICK_EMOJIS = ['👍', '❤️', '🔥', '🎉', '🚀', '😂', '👏'];

export default function MessageInput({ onSendMessage, onTyping }) {
  const [text, setText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const trimmed = text.trim();
    if (!trimmed) return;

    // Immediately clear input state to prevent duplicate submissions
    setText('');
    setShowEmojis(false);

    onSendMessage(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else {
      onTyping();
    }
  };

  const handleAddEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    onTyping();
  };

  return (
    <div style={{
      padding: '16px 24px 20px 24px',
      borderTop: '1px solid var(--border-glass)',
      backgroundColor: 'var(--input-bar-bg)',
      position: 'relative'
    }}>
      {/* Quick Emoji Picker Drawer */}
      {showEmojis && (
        <div className="glass-panel animate-fade-in" style={{
          position: 'absolute',
          bottom: '75px',
          left: '24px',
          padding: '8px 12px',
          borderRadius: '16px',
          display: 'flex',
          gap: '8px',
          zIndex: 10
        }}>
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              style={{
                fontSize: '1.2rem',
                background: 'transparent',
                border: 'none',
                padding: '4px',
                borderRadius: '8px',
                transition: 'transform 0.15s ease'
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojis(!showEmojis)}
          className="icon-badge"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            backgroundColor: showEmojis ? 'var(--my-user-card-bg)' : 'var(--btn-bg)',
            color: showEmojis ? 'var(--accent-primary)' : 'var(--text-muted)'
          }}
          title="Quick Emojis"
        >
          <Smile size={20} />
        </button>

        {/* Input Box */}
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTyping();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message (Press Enter to send)..."
          style={{
            flex: 1,
            padding: '12px 18px',
            borderRadius: '14px',
            backgroundColor: 'var(--input-bg)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-main)',
            fontSize: '0.95rem'
          }}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim()}
          style={{
            padding: '12px 20px',
            borderRadius: '14px',
            background: text.trim() ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.08)',
            color: text.trim() ? '#ffffff' : 'var(--text-dim)',
            fontWeight: '600',
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: text.trim() ? 'var(--accent-glow)' : 'none',
            transition: 'all 0.2s ease',
            opacity: text.trim() ? 1 : 0.6
          }}
        >
          <span>Send</span>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
