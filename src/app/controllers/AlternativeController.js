const AlternativesRepository = require('../repositories/AlternativesRepository');

class AlternativeController {
  async index(req, res) {
    const questions = await AlternativesRepository.findAll();
    res.send(questions);
  }

  async store(req, res) {
    const { content, questionId } = req.body;
    if (!content || !questionId) {
      return res
        .status(400)
        .json({ message: 'Some fields are missing', alternativeCreated: null });
    }

    const alternativesOfThisQuestion =
      await AlternativesRepository.findByQuestionId(questionId);

    if (alternativesOfThisQuestion.length === 4) {
      return res.status(400).json({
        message: 'The limit of alternatives by question it was reached',
        alternativeCreated: null,
      });
    }

    const alternativeCreated = await AlternativesRepository.create({
      content,
      questionId,
    });
    res.json({ message: 'Alternative Created', alternativeCreated });
  }
}

module.exports = new AlternativeController();
