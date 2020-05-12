import { Router } from 'express';
import { QuestController } from '@controllers/';
import { authenticateJWT } from '../middlewares/jwtAuthenticator';

const router = Router();

router.post('/', QuestController.addQuest);
router.put('/', authenticateJWT, QuestController.updateQuest);
router.patch('/', authenticateJWT, QuestController.checkedOrFinal);
router.delete('/', authenticateJWT, QuestController.deleteQuest);

module.exports = router;
