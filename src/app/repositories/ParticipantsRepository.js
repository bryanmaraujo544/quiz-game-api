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

  async findByUsernameAndGameroom({ username, gameroomId }) {
    const participant = await prisma.participant.findFirst({
      where: {
        username,
        AND: [
          {
            gameroom_id: gameroomId,
          },
        ],
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

  async stRemoveParticipant({ socket, payload }) {
    const participantDeleted = await prisma.participant.deleteMany({
      where: {
        username: payload.username,
        AND: [
          {
            gameroom_id: payload.gameroomId,
          },
        ],
      },
    });
    const gameroom = await prisma.gameroom.findFirst({
      where: {
        id: Number(payload.gameroomId),
        AND: [
          {
            is_open: true,
          },
        ],
      },
      include: { participants: true },
    });
    console.log({ gameroom });

    socket.broadcast.emit('participant_left_this_room', {
      username: payload.username,
      gameroomId: payload.gameroomId,
      participantsAmount: gameroom.participants.length,
    });
  }
}

module.exports = new ParticipantsRepository();
