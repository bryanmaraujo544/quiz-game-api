const prisma = require('../../prisma');

class GameroomsRepository {
  async findAll() {
    const gamerooms = await prisma.gameroom.findMany();
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
      },
    });
    console.log({ gameroom });

    socket.broadcast.emit('person_entered_in_room', {
      username: payload.username,
      participantsAmount: gameroom.participants.length,
    });
    // console.log('STJOINROOM', { payload, socket });
  }
}

module.exports = new GameroomsRepository();
