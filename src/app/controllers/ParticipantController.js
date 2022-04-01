const ParticipantsRepository = require('../repositories/ParticipantsRepository');

class ParticipantController {
  async index(req, res) {
    const allParticipants = await ParticipantsRepository.findAll();
    res.send(allParticipants);
  }

  async store(req, res) {
    const { username, gameroomId } = req.body;

    if (!username || !gameroomId) {
      return res
        .status(400)
        .json({ message: 'Some fields are missing', participantCreated: null });
    }

    const userInGameroom =
      await ParticipantsRepository.findByUsernameAndGameroom({
        username,
        gameroomId,
      });

    if (userInGameroom) {
      return res.json({
        message: 'This participant already was created',
        participantCreated: userInGameroom.username,
      });
    }

    const gameroom = await ParticipantsRepository.findGameroomOfParticipant({
      username,
      gameroomId,
    });

    if (gameroom.participants.length === 10) {
      return res.json({
        message: 'The gameroom is full',
        participantCreated: null,
      });
    }

    const participantCreated = await ParticipantsRepository.create({
      username,
      gameroomId,
    });

    res.json({ message: 'Participant Created', participantCreated });
  }

  async checkUsername(req, res) {
    const { username } = req.params;
    if (!username) {
      return res
        .status(400)
        .json({ message: 'Some fields are missing', isAuthorized: false });
    }

    const participant = await ParticipantsRepository.findByUsername(username);
    if (participant) {
      return res
        .status(400)
        .json({ message: 'This username is been used', isAuthorized: false });
    }

    return res.json({ message: 'Authorized', isAuthorized: true });
  }
}

module.exports = new ParticipantController();
