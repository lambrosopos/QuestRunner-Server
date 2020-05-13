import { Router } from 'express';
import { RankController } from '@controllers/';

const router = Router();

router.get('/', RankController.topRanks);

module.exports = router;
