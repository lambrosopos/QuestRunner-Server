import { Router } from 'express';
import { QuestController } from '@controllers/';
import { authenticateJWT } from 'src/middlewares/jwtAuthenticator';

const router = Router();

router.post('/', QuestController.addQuest);
router.put('/', QuestController.updateQuest);
router.put('/checked', QuestController.putChecked);
router.put('/finalize', QuestController.putFinalize);

module.exports = router;
