const GameroomsRepository = require('../repositories/GameroomsRepository');

class GameroomController {
  async index(req, res) {
    const gamerooms = await GameroomsRepository.findAll();
    res.send(gamerooms);
  }

  async store(req, res) {
    const { roomId } = req.body;

    if (!roomId) {
      return res
        .status(400)
        .json({ message: 'Some fields are missing', gameroomCreated: null });
    }

    const hasGameroomWithRoomIdOpen = await GameroomsRepository.findByRoomId({
      roomId,
    });
    if (hasGameroomWithRoomIdOpen) {
      return res.status(400).json({
        message: 'One gameroom with this same room id is already opened ',
        gameroomCreated: null,
      });
    }

    const gameroomCreated = await GameroomsRepository.create({ roomId });
    res.json({ message: 'Gameroom created', gameroomCreated });
  }

  async show(req, res) {
    const { roomId } = req.params;
    const gameroom = await GameroomsRepository.findByRoomId({ roomId });
    res.send(gameroom);
  }
}

module.exports = new GameroomController();
