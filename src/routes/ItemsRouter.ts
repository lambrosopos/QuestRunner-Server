import { Router } from 'express';
import { ItemsController } from '@controllers/';
import { authenticateJWT } from '../middlewares/jwtAuthenticator';

const router = Router();

router.get('/myitems', authenticateJWT, ItemsController.myItems);
router.get('/storeItems', ItemsController.store);
router.post('/purchase', authenticateJWT, ItemsController.purchase);
router.post('/active', authenticateJWT, ItemsController.activate);
router.post('/addItem', ItemsController.add);
router.patch('/modify', ItemsController.modify);

module.exports = router;
