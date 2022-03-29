const prisma = require('../../prisma');
const { server, io } = require('../../index');
console.log('io', server);

class RoomsRepository {
  async findAll() {
    const rooms = await prisma.room.findMany();
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
