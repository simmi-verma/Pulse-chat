const { getAllMessages, createMessage, markMessagesAsRead } = require('../models/messageModel');

// Fetch chat history
async function getMessages(req, res) {
  try {
    const messages = await getAllMessages();
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message history',
      error: error.message
    });
  }
}

// Send message via REST API
async function postMessage(req, res) {
  try {
    const { sender, sender_avatar, text } = req.body;

    if (!sender || !text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Sender and message text are required'
      });
    }

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const timestamp = new Date().toISOString();

    const newMessage = await createMessage({
      id: messageId,
      sender,
      sender_avatar: sender_avatar || '👤',
      text: text.trim(),
      timestamp,
      read_status: 0
    });

    // Broadcast message via Socket.io if io instance attached to request
    if (req.io) {
      req.io.emit('receive_message', newMessage);
    }

    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
}

// Mark messages as read
async function markRead(req, res) {
  try {
    await markMessagesAsRead();
    if (req.io) {
      req.io.emit('messages_marked_read');
    }
    res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getMessages,
  postMessage,
  markRead
};
