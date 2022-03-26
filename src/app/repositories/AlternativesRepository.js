const prisma = require('../../prisma');

class AlternativesRepository {
  async findAll() {
    const alternatives = await prisma.alternative.findMany();
    return alternatives;
  }

  async create({ content, questionId }) {
    const alternative = await prisma.alternative.create({
      data: {
        content,
        question_id: Number(questionId),
      },
    });
    return alternative;
  }

  async findByQuestionId(questionId) {
    const alternatives = await prisma.alternative.findMany({
      where: {
        question_id: Number(questionId),
      },
    });

    return alternatives;
  }
}

module.exports = new AlternativesRepository();
