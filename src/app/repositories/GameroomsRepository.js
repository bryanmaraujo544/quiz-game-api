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
        room_id: Number(roomId),
        AND: [
          {
            is_open: true,
          },
          {
            has_started: false,
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
      },
      include: {
        participants: {
          orderBy: {
            correct_answers: 'desc',
          },
        },
      },
    });
    console.log({ result });
    return result;
  }

  async stJoinRoom({ payload, socket }) {
    const room = await prisma.room.findFirst({
      where: {
        id: Number(payload.roomId) || 10,
      },
      include: {
        gamerooms: {
          where: {
            is_open: true,
            AND: [
              {
                has_started: false,
              },
            ],
          },
          include: {
            participants: true,
          },
        },
      },
    });

    const gameroom = room?.gamerooms[0];
    // Check if the gameroom it isn't full
    if (gameroom?.participants?.length <= 5) {
      socket.broadcast.emit('person_entered_in_room', {
        username: payload.username,
        room: room,
        participantsAmount: gameroom.participants.length,
      });
    }

    // If there are 10 participants, start quiz
    if (gameroom?.participants?.length === 5) {
      // Set the currect gameroom as has_started
      await prisma.gameroom.update({
        where: {
          id: gameroom.id,
        },
        data: {
          is_open: false,
          has_started: true,
        },
      });

      let counter = 30;
      const interval = setInterval(() => {
        if (counter > 0) {
          counter -= 1;
          socket.broadcast.emit('quiz_started', {
            gameroomId: gameroom.id,
            counter,
          }); // emitting to all of other users
          socket.emit('quiz_started', { gameroomId: gameroom.id, counter }); // emitting to user that just entered the room
        }
      }, 1000);

      setTimeout(() => {
        console.log('timeout');
        // Emit to front end that quiz ended and the front grab the results
        socket.broadcast.emit('quiz_ended', { gameroomId: gameroom.id });
        socket.emit('quiz_ended', { gameroomId: gameroom.id });

        (async () => {
          await prisma.gameroom.update({
            where: {
              id: Number(gameroom.id),
            },
            data: {
              is_open: false,
            },
          });
        })();
      }, 1000 * 30);

      setTimeout(() => {
        clearInterval(interval);
      }, 1000 * 40);
    }
  }
}

module.exports = new GameroomsRepository();
