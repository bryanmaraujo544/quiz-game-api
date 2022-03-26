const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();
const http = require('http');
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(routes);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User connect with id: ${socket.id}`);
  let people = 0;

  socket.on('join_room', (data) => {
    console.log(data);
    socket.join(data.roomId);
    people = people + 1;

    socket
      .to(data.roomId)
      .emit('person_entered_in_room', { userId: data.username, people });
  });
});

server.listen(5000, () => {
  console.log('Server is running at port 5000');
});
