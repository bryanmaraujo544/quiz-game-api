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

  async stJoinRoom({ payload, socket }) {
    const gameroom = await prisma.gameroom.findFirst({
      where: {
        room_id: Number(payload.roomId),
        AND: [
          {
            is_open: true,
          },
        ],
      },
      include: {
        participants: true,
        room: true,
      },
    });

    if (gameroom.participants.length < 10) {
      console.log('minor than 10');
      socket.broadcast.emit('person_entered_in_room', {
        username: payload.username,
        gameroom: gameroom,
        participantsAmount: gameroom.participants.length,
      });

      return;
    }

    // If there are 10 participants, start quiz
    // socket.broadcast.emit('quiz_started', { roomId: gameroom.id });
  }
}

module.exports = new GameroomsRepository();
