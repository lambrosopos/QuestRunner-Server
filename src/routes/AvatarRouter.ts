import multer from 'multer';
import { Router } from 'express';
import { AvatarController } from '@controllers/';

const upload = multer();
const router = Router();

router.get('/', AvatarController.get);
router.put('/', upload.single('avatar'), AvatarController.put);

module.exports = router;
