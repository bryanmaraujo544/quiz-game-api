const RoomsRepository = require('../repositories/RoomsRepository');
const { server, io } = require('../../index.js');
console.log('SERVER', server);

class RoomController {
  async index(req, res) {
    const rooms = await RoomsRepository.findAll({
      payload: null,
      socket: null,
    });
    res.send(rooms);
  }

  async store(req, res) {
    const { title, photoUrl } = req.body;
    if (!title || !photoUrl) {
      res
        .status(400)
        .json({ message: 'Some fields are missing', roomCreated: null });
    }

    const roomCreated = await RoomsRepository.create({ title, photoUrl });
    res.json({ message: 'Room Created', roomCreated });
  }
}

module.exports = new RoomController();
