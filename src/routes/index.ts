import { Router } from 'express';

// For simple get routes
import {
  QuestController,
  UserController,
  RankController,
  ItemsController,
} from '@controllers/';
import { authenticateJWT } from '../middlewares/jwtAuthenticator';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/user', require('./UserRouter'));
router.use('/avatar', require('./AvatarRouter'));
router.use('/quest', authenticateJWT, require('./QuestRouter'));
router.use('/rank', require('./RankRouter'));
router.use('/items', require('./ItemsRouter'));

// Adding simple get routes
router.get('/quests', authenticateJWT, QuestController.retrieveQuests);
router.get('/userinfo', authenticateJWT, UserController.getInfo);
router.post('/userlogin', UserController.signin);
router.get('/myRank', authenticateJWT, RankController.myRank);

router.post('/', authenticateJWT, ItemsController.darkmode);
// Export the base-router
export default router;
