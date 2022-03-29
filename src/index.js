const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`User connect with id: ${socket.id}`);
  // let people = 0;

  // socket.on('join_room', (data) => {
  //   console.log(data);
  //   socket.join(data.roomId);
  //   people = people + 1;

  //   socket
  //     .to(data.roomId)
  //     .emit('person_entered_in_room', { userId: data.username, people });
  // });
});
app.use(cors());
app.use(express.json());
app.use(routes);

module.exports = { server, io };
