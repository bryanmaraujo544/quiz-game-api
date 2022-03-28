const prisma = require('../../prisma');
const index = require('../../index');
console.log('index', index);
class RoomsRepository {
  async findAll() {
    const rooms = await prisma.room.findMany();
    // io.emit('findAll', { data: 'DATADATADATA' });

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
