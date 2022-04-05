const prisma = require('../../prisma');

class RoomsRepository {
  async findAll() {
    const rooms = await prisma.room.findMany({
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
        questions: {
          include: {
            alternatives: true,
          },
        },
      },
    });
    return rooms;
  }

  async create({ title, photoUrl }) {
    const roomCreated = await prisma.room.create({
      data: {
        title,
        photo_url: photoUrl,
      },
    });

    return roomCreated;
  }
}

module.exports = new RoomsRepository();
