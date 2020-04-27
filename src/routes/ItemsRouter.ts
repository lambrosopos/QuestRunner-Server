import { Router } from "express";
import { ItemsController } from "../controllers";

const router = Router();

router.get("/myitems", ItemsController.getMyItems);
router.get("/storeItems", ItemsController.getStoreItems);
router.post("/purchase", ItemsController.postPurchaseItem);
router.post("/active", ItemsController.postActivateItem);

module.exports = router;
