const { getDatabase } = require('../config/database');

async function getAllMessages(room = 'general-lounge') {
  const db = await getDatabase();
  return db.all('SELECT * FROM messages WHERE room = ? OR room IS NULL ORDER BY timestamp ASC', [room]);
}

async function createMessage({ id, sender, sender_avatar, text, timestamp, read_status = 0, room = 'general-lounge' }) {
  const db = await getDatabase();
  const messageTime = timestamp || new Date().toISOString();

  // Deduplicate rapid identical submissions within 3 seconds
  const windowStart = new Date(Date.now() - 3000).toISOString();
  const existing = await db.get(
    `SELECT * FROM messages WHERE sender = ? AND text = ? AND room = ? AND timestamp >= ?`,
    [sender, text, room, windowStart]
  );

  if (existing) {
    return existing;
  }

  await db.run(
    `INSERT INTO messages (id, sender, sender_avatar, text, timestamp, read_status, room) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, sender, sender_avatar || '👤', text, messageTime, read_status, room]
  );
  return { id, sender, sender_avatar: sender_avatar || '👤', text, timestamp: messageTime, read_status, room };
}

async function markMessagesAsRead() {
  const db = await getDatabase();
  await db.run('UPDATE messages SET read_status = 1 WHERE read_status = 0');
}

module.exports = {
  getAllMessages,
  createMessage,
  markMessagesAsRead
};
