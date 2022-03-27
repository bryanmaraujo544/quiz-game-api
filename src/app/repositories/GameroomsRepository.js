const prisma = require('../../prisma');

class GameroomsRepository {
  async findAll() {
    const gamerooms = await prisma.gameroom.findMany();
    return gamerooms;
  }

  async create({ roomId }) {
    console.log({ roomId });
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
    });

    return gameroom;
  }
}

module.exports = new GameroomsRepository();
