const prisma = require('../../prisma');

class QuestionsRepository {
  async findAll() {
    const questions = await prisma.question.findMany({
      include: {
        alternatives: {
          select: {
            id: true,
            content: true,
          },
        },
      },
    });
    return questions;
  }

  async create({ content, correctAnswer, roomId }) {
    const questionCreated = await prisma.question.create({
      data: {
        content,
        correct_answer: correctAnswer,

        room_id: Number(roomId),
      },
    });
    return questionCreated;
  }
}

module.exports = new QuestionsRepository();
