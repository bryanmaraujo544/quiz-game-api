const res = require('express/lib/response');
const QuestionsRepository = require('../repositories/QuestionsRepository');

class QuestionController {
  async index(req, res) {
    const questions = await QuestionsRepository.findAll();
    res.send(questions);
  }

  async showByRoomId(req, res) {
    const { roomId } = req.params;
    const questions = await QuestionsRepository.findByRoomId(roomId);
    res.send(questions);
  }

  async store(req, res) {
    const { content, correctAnswer, roomId } = req.body;
    if (!content || !correctAnswer || !roomId) {
      res
        .status(400)
        .json({ message: 'Some fields are missing', questionCreated: null });
    }

    const questionCreated = await QuestionsRepository.create({
      content,
      correctAnswer,
      roomId,
    });

    res.json({ message: 'Question Created', questionCreated });
  }
}

module.exports = new QuestionController();
