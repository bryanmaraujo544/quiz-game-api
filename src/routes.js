const { Router } = require('express');
const AlternativeController = require('./app/controllers/AlternativeController');
const QuestionController = require('./app/controllers/QuestionController');
const RoomController = require('./app/controllers/RoomController');

const router = Router();

router.get('/', (req, res) => {
  res.send('index page');
});

router.get('/rooms', RoomController.index);
router.post('/rooms', RoomController.store);

router.get('/questions', QuestionController.index);
router.post('/questions', QuestionController.store);

router.get('/alternatives', AlternativeController.index);
router.post('/alternatives', AlternativeController.store);

module.exports = router;
