const prisma = require('../../prisma');
class ParticipantsRepository {
  async findAll() {
    const participants = await prisma.participant.findMany();
    return participants;
  }

  async create({ username, gameroomId }) {
    const participant = await prisma.participant.create({
      data: {
        username,
        gameroom_id: Number(gameroomId),
      },
    });

    return participant;
  }

  async findByUsername(username) {
    const participant = await prisma.participant.findFirst({
      where: {
        username,
      },
    });

    return participant;
  }

  async findByUsernameAndGameroom({ username, gameroomId }) {
    const gameroom = await prisma.participant.findFirst({
      where: {
        username,
        AND: [
          {
            gameroom_id: Number(gameroomId),
          },
        ],
      },
    });
    return gameroom;
  }
}

module.exports = new ParticipantsRepository();
