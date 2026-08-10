const { getDatabase } = require('../config/database');

async function getAllMessages() {
  const db = await getDatabase();
  return db.all('SELECT * FROM messages ORDER BY timestamp ASC');
}

async function createMessage({ id, sender, sender_avatar, text, timestamp, read_status = 0 }) {
  const db = await getDatabase();
  const messageTime = timestamp || new Date().toISOString();
  await db.run(
    `INSERT INTO messages (id, sender, sender_avatar, text, timestamp, read_status) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, sender, sender_avatar || '👤', text, messageTime, read_status]
  );
  return { id, sender, sender_avatar: sender_avatar || '👤', text, timestamp: messageTime, read_status };
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
