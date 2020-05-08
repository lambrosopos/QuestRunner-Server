import multer from 'multer';
import { Router } from 'express';
import { AvatarController } from '@controllers/';
import { authenticateJWT } from 'src/middlewares/jwtAuthenticator';

const upload = multer();
const router = Router();

router.get('/', authenticateJWT, AvatarController.get);
router.post(
  '/',
  authenticateJWT,
  upload.single('avatar'),
  AvatarController.post
);

module.exports = router;
