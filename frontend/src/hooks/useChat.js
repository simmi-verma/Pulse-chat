import { useState, useEffect, useCallback, useRef } from 'react';
import { socket, connectSocket } from '../services/socket';
import { fetchChatHistory, sendApiMessage } from '../services/api';

// Helper to deduplicate array of messages
function deduplicateMessages(msgArray) {
  if (!Array.isArray(msgArray)) return [];
  const seenIds = new Set();
  const seenKeys = new Set();
  const result = [];

  for (const msg of msgArray) {
    if (!msg || !msg.id) continue;
    const contentKey = `${msg.sender}_${msg.text}_${msg.room || 'general-lounge'}_${Math.floor(new Date(msg.timestamp).getTime() / 4000)}`;

    if (!seenIds.has(msg.id) && !seenKeys.has(contentKey)) {
      seenIds.add(msg.id);
      seenKeys.add(contentKey);
      result.push(msg);
    }
  }

  return result;
}

export function useChat(currentUser) {
  const [activeRoom, setActiveRoom] = useState('general-lounge');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [toast, setToast] = useState(null);

  const typingTimeoutRef = useRef(null);
  const activeRoomRef = useRef(activeRoom);

  // Keep activeRoomRef synced
  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  // Trigger toast alert
  const showToast = useCallback((message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Fetch chat history for specified room via REST API
  const loadHistory = useCallback(async (roomToLoad) => {
    try {
      setIsLoadingHistory(true);
      const res = await fetchChatHistory(roomToLoad);
      if (res && res.success) {
        setMessages(deduplicateMessages(res.data || []));
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
      showToast('Could not fetch message history.', 'error');
    } finally {
      setIsLoadingHistory(false);
    }
  }, [showToast]);

  // Load history whenever activeRoom changes
  useEffect(() => {
    loadHistory(activeRoom);
    if (socket.connected) {
      socket.emit('join_room', activeRoom);
    }
  }, [activeRoom, loadHistory]);

  const switchRoom = (roomName) => {
    if (!roomName || roomName === activeRoom) return;
    setActiveRoom(roomName);
    if (socket.connected) {
      socket.emit('join_room', roomName);
    }
  };

  // Connect and bind socket listeners (Persistent connection)
  useEffect(() => {
    if (!currentUser || !currentUser.username) return;

    connectSocket(currentUser);

    const onConnect = () => {
      setIsConnected(true);
      socket.emit('user_join', {
        username: currentUser.username,
        avatar: currentUser.avatar
      });
      socket.emit('join_room', activeRoomRef.current);
    };

    const onDisconnect = (reason) => {
      setIsConnected(false);
      console.log('Socket disconnected:', reason);
    };

    const onReceiveMessage = (newMessage) => {
      if (!newMessage) return;
      const msgRoom = newMessage.room || 'general-lounge';
      if (msgRoom === activeRoomRef.current) {
        setMessages((prev) => deduplicateMessages([...prev, newMessage]));
      }
    };

    const onOnlineUsers = (users) => {
      setOnlineUsers(users || []);
    };

    const onUserStatusChange = ({ user, status }) => {
      if (user && user.username !== currentUser.username) {
        showToast(`${user.avatar || '👤'} ${user.username} ${status === 'joined' ? 'joined' : 'left'} the chat`, 'status');
      }
    };

    const onUserTyping = ({ username }) => {
      if (username !== currentUser.username) {
        setTypingUsers((prev) => Array.from(new Set([...prev, username])));
      }
    };

    const onUserStopTyping = ({ username }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    };

    const onMessagesRead = () => {
      setMessages((prev) =>
        prev.map((msg) => ({ ...msg, read_status: 1 }))
      );
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);
    socket.on('online_users', onOnlineUsers);
    socket.on('user_status_change', onUserStatusChange);
    socket.on('user_typing', onUserTyping);
    socket.on('user_stop_typing', onUserStopTyping);
    socket.on('messages_read', onMessagesRead);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceiveMessage);
      socket.off('online_users', onOnlineUsers);
      socket.off('user_status_change', onUserStatusChange);
      socket.off('user_typing', onUserTyping);
      socket.off('user_stop_typing', onUserStopTyping);
      socket.off('messages_read', onMessagesRead);
    };
  }, [currentUser?.username, showToast]);

  // Send message function (Uses Socket.io, fallback to REST API)
  const sendMessage = async (text) => {
    if (!text || text.trim() === '' || !currentUser) return;

    const payload = {
      sender: currentUser.username,
      sender_avatar: currentUser.avatar,
      text: text.trim(),
      room: activeRoomRef.current
    };

    if (socket.connected) {
      socket.emit('send_message', payload);
    } else {
      // Fallback REST API if socket is disconnected
      try {
        const response = await sendApiMessage(payload);
        if (response && response.success) {
          setMessages((prev) => deduplicateMessages([...prev, response.data]));
        }
      } catch (err) {
        showToast('Failed to send message over HTTP fallback', 'error');
      }
    }
  };

  // Handle typing triggers
  const sendTypingNotification = () => {
    if (!socket.connected || !currentUser) return;
    socket.emit('typing_start', { username: currentUser.username });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { username: currentUser.username });
    }, 1800);
  };

  const markAllAsRead = () => {
    if (socket.connected) {
      socket.emit('mark_read');
    }
  };

  return {
    activeRoom,
    messages,
    onlineUsers,
    typingUsers,
    isConnected,
    isLoadingHistory,
    toast,
    switchRoom,
    sendMessage,
    sendTypingNotification,
    markAllAsRead,
    refreshHistory: () => loadHistory(activeRoomRef.current)
  };
}
