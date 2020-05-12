import { Router } from 'express';
import { QuestController } from '@controllers/';

const router = Router();

router.post('/', QuestController.addQuest);
router.put('/', QuestController.updateQuest);
router.patch('/', QuestController.checkedOrFinal);
router.delete('/', QuestController.deleteQuest);

module.exports = router;
