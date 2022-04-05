const { Router } = require('express');
const AlternativeController = require('./app/controllers/AlternativeController');
const GameroomController = require('./app/controllers/GameroomController');
const ParticipantController = require('./app/controllers/ParticipantController');
const QuestionController = require('./app/controllers/QuestionController');
const RoomController = require('./app/controllers/RoomController');

const router = Router();

router.get('/', (req, res) => {
  res.send('index page');
});

router.get('/rooms', RoomController.index);
router.post('/rooms', RoomController.store);

router.get('/gamerooms', GameroomController.index);
router.post('/gamerooms', GameroomController.store);
router.get('/gamerooms/:roomId', GameroomController.showByRoomId);
router.get('/gamerooms/results/:gameroomId', GameroomController.getResults);

router.get('/questions', QuestionController.index);
router.get('/questions/:roomId', QuestionController.showByRoomId);
router.post('/questions', QuestionController.store);

router.get('/alternatives', AlternativeController.index);
router.post('/alternatives', AlternativeController.store);

router.get('/participants', ParticipantController.index);
router.post('/participants', ParticipantController.store);
router.get(
  '/participants/check/:username',
  ParticipantController.checkUsername
);
router.put('/participants/:participantId', ParticipantController.update);

module.exports = router;
