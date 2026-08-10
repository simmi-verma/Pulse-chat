const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db = null;

async function getDatabase() {
  if (db) return db;

  const dbPath = process.env.DATABASE_FILE || path.join(__dirname, '../../database.sqlite');

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      sender TEXT NOT NULL,
      sender_avatar TEXT,
      text TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      read_status INTEGER DEFAULT 0,
      room TEXT DEFAULT 'general-lounge'
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      avatar TEXT,
      status TEXT DEFAULT 'offline',
      last_seen TEXT
    );
  `);

  try {
    await db.exec(`ALTER TABLE messages ADD COLUMN room TEXT DEFAULT 'general-lounge'`);
  } catch (e) {
    // Column already exists
  }

  // Purge duplicate rows if any exist from rapid re-submits
  try {
    await db.exec(`
      DELETE FROM messages
      WHERE rowid NOT IN (
        SELECT MIN(rowid)
        FROM messages
        GROUP BY sender, text, room, timestamp
      )
    `);
  } catch (e) {
    console.error('Error cleaning duplicate messages:', e);
  }

  // Seed sample messages if table is empty
  const count = await db.get('SELECT COUNT(*) as count FROM messages');
  if (count.count === 0) {
    const initialMessages = [
      {
        id: 'msg-welcome-1',
        sender: 'System Admin',
        sender_avatar: '⚡',
        text: 'Welcome to the Real-Time Pulse Chat application! 🚀',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read_status: 1
      },
      {
        id: 'msg-welcome-2',
        sender: 'System Admin',
        sender_avatar: '⚡',
        text: 'Messages are persisted in SQLite and broadcast in real-time via Socket.io.',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read_status: 1
      }
    ];

    for (const msg of initialMessages) {
      await db.run(
        `INSERT INTO messages (id, sender, sender_avatar, text, timestamp, read_status) VALUES (?, ?, ?, ?, ?, ?)`,
        [msg.id, msg.sender, msg.sender_avatar, msg.text, msg.timestamp, msg.read_status]
      );
    }
  }

  return db;
}

module.exports = { getDatabase };
