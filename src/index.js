const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use((error, req, res, next) => {
  console.log('ERROR HANDLER', error);
  res.sendStatus(500);
});
app.use(routes);

const RoomsRepository = require('./app/repositories/RoomsRepository');
const GameroomsRepository = require('./app/repositories/GameroomsRepository');
const ParticipantsRepository = require('./app/repositories/ParticipantsRepository');

function createApplication(httpServer, components, serverOptions = {}) {
  const io = new Server(httpServer, serverOptions);

  io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);
    socket.on('join_room', (payload) => {
      socket.join(payload.roomId);

      return GameroomsRepository.stJoinRoom({ payload, socket });
    });

    socket.on('rooms_opened', (payload) => {
      return RoomsRepository.findAll({ payload, socket });
    });

    socket.on('participant_left_room', (payload) => {
      return ParticipantsRepository.stRemoveParticipant({ payload, socket });
    });
  });

  return io;
}

module.exports = { server, createApplication };
