const prisma = require('../../prisma');

class GameroomsRepository {
  async findAll() {
    const gamerooms = await prisma.gameroom.findMany({
      include: {
        room: true,
        participants: true,
      },
      where: {
        is_open: true,
      },
    });

    return gamerooms;
  }

  async create({ roomId }) {
    const gameroomCreated = await prisma.gameroom.create({
      data: {
        room_id: roomId,
      },
    });

    return gameroomCreated;
  }

  async findByRoomId({ roomId }) {
    const gameroom = await prisma.gameroom.findFirst({
      where: {
        room_id: roomId,
        AND: [
          {
            is_open: true,
          },
        ],
      },
      include: {
        participants: true,
      },
    });

    return gameroom;
  }

  async getResults({ gameroomId }) {
    const result = await prisma.gameroom.findFirst({
      where: {
        id: Number(gameroomId),
        AND: [
          {
            is_open: true,
          },
        ],
      },
      include: {
        participants: {
          orderBy: {
            correct_answers: 'desc',
          },
        },
      },
    });
    return result;
  }

  async stJoinRoom({ payload, socket }) {
    const room = await prisma.room.findFirst({
      where: {
        id: Number(payload.roomId),
      },
      include: {
        gamerooms: {
          where: {
            is_open: true,
          },
          include: {
            participants: true,
          },
        },
      },
    });

    const gameroom = room?.gamerooms[0];
    if (gameroom.participants.length <= 10) {
      socket.broadcast.emit('person_entered_in_room', {
        username: payload.username,
        room: room,
        participantsAmount: gameroom.participants.length,
      });
    }

    // If there are 10 participants, start quiz
    if (gameroom.participants.length === 10) {
      let counter = 120;
      const interval = setInterval((oi) => {
        console.log(counter);
        if (counter > 0) {
          counter -= 1;
          socket.broadcast.emit('quiz_started', {
            gameroomId: gameroom.id,
            counter,
          }); // emitting to all of other users
          socket.emit('quiz_started', { gameroomId: gameroom.id, counter }); // emitting to user that just entered the room
          return;
        } else {
          return;
        }
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
      }, 1000 * 130);

      setTimeout(() => {
        // Emit to front end that quiz ended and the front grab the results
        socket.broadcast.emit('quiz_ended', { gameroomId: gameroom.id });
        socket.emit('quiz_ended', { gameroomId: gameroom.id });
      }, 1000 * 120);
    }
  }
}

module.exports = new GameroomsRepository();
