import { Router } from 'express';
import { RankController } from '@controllers/';
import { authenticateJWT } from '../middlewares/jwtAuthenticator';
const router = Router();

router.get('/', RankController.topRanks);

module.exports = router;
