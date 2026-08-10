import React, { useState, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import TypingIndicator from './components/TypingIndicator';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';

export default function App() {
  // Theme state (default to crisp light/white theme)
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // User state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('pulse_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync theme attribute to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pulse_theme', theme);
  }, [theme]);

  // Handle user login / switch
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('pulse_user', JSON.stringify(user));
  };

  const handleSwitchUser = () => {
    localStorage.removeItem('pulse_user');
    setCurrentUser(null);
  };

  // Custom Chat Hook
  const {
    messages,
    onlineUsers,
    typingUsers,
    isConnected,
    isLoadingHistory,
    toast,
    sendMessage,
    sendTypingNotification,
    refreshHistory
  } = useChat(currentUser);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-primary)'
    }}>
      {/* Auth Modal if user is not logged in */}
      {!currentUser && <AuthModal onLogin={handleLogin} />}

      {/* Main Header */}
      <Header
        currentUser={currentUser}
        isConnected={isConnected}
        onlineCount={onlineUsers.length}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onSwitchUser={handleSwitchUser}
        onRefresh={refreshHistory}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Workspace (Sidebar + Chat Area) */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Sidebar
          onlineUsers={onlineUsers}
          currentUser={currentUser}
          isOpen={sidebarOpen}
          messageCount={messages.length}
        />

        {/* Chat Window */}
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 64px)',
          backgroundColor: 'var(--bg-glass-card)'
        }}>
          <MessageList
            messages={messages}
            currentUser={currentUser}
            isLoading={isLoadingHistory}
          />

          <TypingIndicator typingUsers={typingUsers} />

          <MessageInput
            onSendMessage={sendMessage}
            onTyping={sendTypingNotification}
          />
        </main>
      </div>

      {/* Toast Notifications */}
      <Toast toast={toast} />
    </div>
  );
}
