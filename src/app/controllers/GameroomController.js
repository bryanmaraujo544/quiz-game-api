const GameroomsRepository = require('../repositories/GameroomsRepository');

class GameroomController {
  async index(req, res) {
    const gamerooms = await GameroomsRepository.findAll();
    res.send(gamerooms);
  }

  async showByRoomId(req, res) {
    const { roomId } = req.params;
    const gameroom = await GameroomsRepository.findByRoomId(roomId);
    console.log('showByRoomId', gameroom);
    res.send(gameroom);
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

  async getResults(req, res) {
    const { gameroomId } = req.params;
    console.log({ gameroomId });
    const gameroomWithResult = await GameroomsRepository.getResults({
      gameroomId,
    });
    res.send(gameroomWithResult);
  }
}

module.exports = new GameroomController();
