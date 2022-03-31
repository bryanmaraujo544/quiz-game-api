const prisma = require('../../prisma');
const { server, io } = require('../../index');

class RoomsRepository {
  // constructor({ payload }) {
  //   this.socket = socket;
  // }

  async findAll({ payload, socket }) {
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
