const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const waitingQueue = [];
const QUEUE_TIMEOUT_MS = 60000;
const socketIdToPartnerId = new Map();
const socketIdToRoom = new Map();

function purgeExpiredFromQueue() {
  const now = Date.now();
  for (let i = waitingQueue.length - 1; i >= 0; i--) {
    const entry = waitingQueue[i];
    if (!entry.socket.connected || now - entry.enqueuedAt > QUEUE_TIMEOUT_MS) {
      waitingQueue.splice(i, 1);
    }
  }
}

setInterval(purgeExpiredFromQueue, 5000);

io.on('connection', (socket) => {
  purgeExpiredFromQueue();
  if (waitingQueue.length === 0) {
    waitingQueue.push({ socket, enqueuedAt: Date.now() });
  } else {
    let partnerEntry = null;
    while (waitingQueue.length && !partnerEntry) {
      const candidate = waitingQueue.shift();
      if (candidate.socket.connected && Date.now() - candidate.enqueuedAt <= QUEUE_TIMEOUT_MS) {
        partnerEntry = candidate;
      }
    }
    if (partnerEntry) {
      const partner = partnerEntry.socket;
      const room = `${socket.id},${partner.id}`;
      socket.join(room);
      partner.join(room);
      socket.emit('paired', { status: 'paired', room });
      partner.emit('paired', { status: 'paired', room });
      socketIdToPartnerId.set(socket.id, partner.id);
      socketIdToPartnerId.set(partner.id, socket.id);
      socketIdToRoom.set(socket.id, room);
      socketIdToRoom.set(partner.id, room);
    } else {
      waitingQueue.push({ socket, enqueuedAt: Date.now() });
    }
  }

  socket.on('announce', (payload) => {
    if (payload && payload.room && payload.name) {
      io.to(payload.room).emit('name', { name: payload.name });
    }
  });

  socket.on('chat', (payload) => {
    if (payload && payload.room && payload.message) {
      io.to(payload.room).emit('message', { message: payload.message });
    }
  });

  socket.on('image', (payload) => {
    if (payload && payload.room && payload.image) {
      io.to(payload.room).emit('image', { image: payload.image });
    }
  });

  socket.on('disconnecting', () => {
    const idx = waitingQueue.findIndex((e) => e.socket.id === socket.id);
    if (idx !== -1) waitingQueue.splice(idx, 1);
  });

  socket.on('disconnect', () => {
    const partnerId = socketIdToPartnerId.get(socket.id);
    const room = socketIdToRoom.get(socket.id);
    if (partnerId) {
      socketIdToPartnerId.delete(partnerId);
      socketIdToRoom.delete(partnerId);
      io.to(partnerId).emit('partner_disconnected', { room });
    }
    socketIdToPartnerId.delete(socket.id);
    socketIdToRoom.delete(socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


