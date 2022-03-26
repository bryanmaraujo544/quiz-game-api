const QuestionsRepository = require('../repositories/QuestionsRepository');

class QuestionController {
  async index(req, res) {
    const questions = await QuestionsRepository.findAll();
    res.send(questions);
  }

  async store(req, res) {
    const { content, correctAnswer, roomId } = req.body;
    if (!content || !correctAnswer || !roomId) {
      res
        .status(400)
        .json({ message: 'Some fields are missing', questionCreted: null });
    }

    const questionCreted = await QuestionsRepository.create({
      content,
      correctAnswer,
      roomId,
    });

    res.json({ message: 'Question Created', questionCreted });
  }
}

module.exports = new QuestionController();
