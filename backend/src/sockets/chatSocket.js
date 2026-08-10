const { createMessage, markMessagesAsRead } = require('../models/messageModel');

// Active socket sessions store
const activeUsers = new Map(); // socketId -> { username, avatar, socketId }

function initChatSocket(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Handle user registration / login over socket
    socket.on('user_join', ({ username, avatar }) => {
      if (!username) return;

      const userObj = {
        socketId: socket.id,
        username: username.trim(),
        avatar: avatar || '👤',
        joinedAt: new Date().toISOString()
      };

      activeUsers.set(socket.id, userObj);

      console.log(`[Socket.io] User joined: ${username} (${socket.id})`);

      // Broadcast updated online users list to all clients
      const onlineList = Array.from(activeUsers.values());
      io.emit('online_users', onlineList);

      // Notify others that a user joined
      socket.broadcast.emit('user_status_change', {
        user: userObj,
        status: 'joined',
        timestamp: new Date().toISOString()
      });
    });

    // Handle incoming real-time message
    socket.on('send_message', async (data) => {
      try {
        const { sender, sender_avatar, text } = data;
        if (!sender || !text || text.trim() === '') return;

        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        const timestamp = new Date().toISOString();

        // Persist message in SQLite database
        const savedMessage = await createMessage({
          id: messageId,
          sender,
          sender_avatar: sender_avatar || '👤',
          text: text.trim(),
          timestamp,
          read_status: 0
        });

        // Broadcast to ALL connected clients instantly
        io.emit('receive_message', savedMessage);
      } catch (err) {
        console.error('[Socket.io] Error processing message:', err);
        socket.emit('socket_error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      socket.broadcast.emit('user_typing', {
        username: data.username || 'Someone'
      });
    });

    socket.on('typing_stop', (data) => {
      socket.broadcast.emit('user_stop_typing', {
        username: data.username || 'Someone'
      });
    });

    // Handle mark read status
    socket.on('mark_read', async () => {
      try {
        await markMessagesAsRead();
        io.emit('messages_read');
      } catch (err) {
        console.error('[Socket.io] Error marking read:', err);
      }
    });

    // Handle client disconnection gracefully
    socket.on('disconnect', () => {
      const user = activeUsers.get(socket.id);
      if (user) {
        activeUsers.delete(socket.id);
        console.log(`[Socket.io] User disconnected: ${user.username} (${socket.id})`);

        // Broadcast updated user list
        const onlineList = Array.from(activeUsers.values());
        io.emit('online_users', onlineList);

        // Notify others
        socket.broadcast.emit('user_status_change', {
          user,
          status: 'left',
          timestamp: new Date().toISOString()
        });
      } else {
        console.log(`[Socket.io] Socket disconnected: ${socket.id}`);
      }
    });
  });
}

module.exports = { initChatSocket };
