const prisma = require('../../prisma');

class GameroomsRepository {
  async findAll() {
    const gamerooms = await prisma.gameroom.findMany();
    return gamerooms;
  }

  async create({ roomId }) {
    const gameroomCreated = await prisma.gameroom.create({
      data: {
        room_id: Number(roomId),
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
        ],
      },
      include: {
        participants: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return gameroom;
  }
}

module.exports = new GameroomsRepository();
