import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('chat.db');

export function initializeDatabase() {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, room TEXT, sender TEXT, content TEXT, isImage INTEGER, createdAt INTEGER)'
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS rooms (room TEXT PRIMARY KEY, peerName TEXT, peerImage TEXT, updatedAt INTEGER)'
    );
  });
}

export function saveMessage({ room, sender, content, isImage, createdAt }) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO messages (room, sender, content, isImage, createdAt) VALUES (?, ?, ?, ?, ?)',
        [room, sender, content, isImage ? 1 : 0, createdAt],
        (_, result) => resolve(result.insertId),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export function loadMessages(room, limit = 100) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT id, room, sender, content, isImage, createdAt FROM messages WHERE room = ? ORDER BY createdAt ASC LIMIT ?',
        [room, limit],
        (_, { rows }) => {
          const items = rows._array.map((r) => ({
            id: r.id,
            room: r.room,
            sender: r.sender,
            content: r.content,
            isImage: !!r.isImage,
            createdAt: r.createdAt
          }));
          resolve(items);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export function loadRoomsWithLastMessage() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT r.room as room,
                r.peerName as peerName,
                r.peerImage as peerImage,
                COALESCE((SELECT content FROM messages WHERE room = r.room ORDER BY createdAt DESC LIMIT 1), '') as lastMessage,
                (SELECT createdAt FROM messages WHERE room = r.room ORDER BY createdAt DESC LIMIT 1) as lastAt
         FROM rooms r
         UNION
         SELECT m.room as room,
                NULL as peerName,
                NULL as peerImage,
                (SELECT content FROM messages WHERE room = m.room ORDER BY createdAt DESC LIMIT 1) as lastMessage,
                (SELECT createdAt FROM messages WHERE room = m.room ORDER BY createdAt DESC LIMIT 1) as lastAt
         FROM messages m
         WHERE m.room NOT IN (SELECT room FROM rooms)
         GROUP BY m.room
         ORDER BY lastAt DESC`,
        [],
        (_, { rows }) => resolve(rows._array || []),
        (_, error) => { reject(error); return false; }
      );
    });
  });
}

export function saveRoomMeta(room, { peerName, peerImage }) {
  return new Promise((resolve, reject) => {
    const updatedAt = Date.now();
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO rooms (room, peerName, peerImage, updatedAt) VALUES (?, ?, ?, ?) ON CONFLICT(room) DO UPDATE SET peerName=COALESCE(?, rooms.peerName), peerImage=COALESCE(?, rooms.peerImage), updatedAt=?',
        [room, peerName || null, peerImage || null, updatedAt, peerName || null, peerImage || null, updatedAt],
        () => resolve(true),
        (_, error) => { reject(error); return false; }
      );
    });
  });
}



