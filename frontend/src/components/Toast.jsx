import React from 'react';
import { Info, AlertCircle, Sparkles } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isStatus = toast.type === 'status';

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '85px',
        right: '24px',
        zIndex: 999,
        padding: '10px 16px',
        borderRadius: '14px',
        backgroundColor: isError ? 'rgba(239, 68, 68, 0.9)' : 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(10px)',
        color: '#ffffff',
        border: isError ? '1px solid #ef4444' : '1px solid var(--border-glow)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.85rem',
        maxWidth: '320px'
      }}
    >
      {isError ? (
        <AlertCircle size={18} color="#ffffff" />
      ) : isStatus ? (
        <Sparkles size={18} color="var(--accent-primary)" />
      ) : (
        <Info size={18} color="#60a5fa" />
      )}
      <span>{toast.message}</span>
    </div>
  );
}
