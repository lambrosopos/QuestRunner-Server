import { Router } from 'express';
import { UserController } from '@controllers/';
import { authenticateJWT } from '../middlewares/jwtAuthenticator';
const router = Router();

router.post('/', UserController.signup);
router.patch('/', authenticateJWT, UserController.modify);

module.exports = router;
