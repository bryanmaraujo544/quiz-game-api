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
      include: {
        gameroom: true,
      },
    });

    return participant;
  }

  async update({
    participantId,
    correctAnswers,
    incorrectAnswers,
    secondsRest,
  }) {
    const participant = await prisma.participant.update({
      where: {
        id: Number(participantId),
      },
      data: {
        correct_answers: correctAnswers,
        incorrect_answers: incorrectAnswers,
        seconds_rest: secondsRest,
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

  async findGameroomOfParticipant({ gameroomId }) {
    const gameroom = await prisma.gameroom.findFirst({
      where: {
        id: Number(gameroomId),
      },
      include: {
        participants: true,
      },
    });

    return gameroom;
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

    try {
      const gameroomOfUser = await prisma.gameroom.findFirst({
        where: {
          id: payload.gameroomId,
          AND: [
            {
              is_open: true,
            },
          ],
        },
        include: { participants: true, room: true },
      });

      // When the room finishes, the is_open is updated to false, so when the users of this room left this above gameroomOfUser fails
      if (gameroomOfUser) {
        const room = await prisma.room.findFirst({
          where: {
            id: Number(gameroomOfUser?.room?.id),
          },
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
          },
        });

        const gameroom = room?.gamerooms[0];
        const participants = gameroom?.participants;

        socket.broadcast.emit('participant_left_this_room', {
          username: payload.username,
          gameroomId: payload.gameroomId,
          room: room,
          participantsAmount: participants?.length,
        });
      }
    } catch (err) {
      console.log('err in remove participant', err);
    }
  }
}

module.exports = new ParticipantsRepository();
