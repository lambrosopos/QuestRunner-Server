import { Router } from "express";
import { ItemsController } from "@controllers/";
import { authenticateJWT } from "../middlewares/jwtAuthenticator";

const router = Router();

router.get("/myitems", authenticateJWT, ItemsController.getMyItems);
router.get("/storeItems", ItemsController.getStoreItems);
router.post("/purchase", authenticateJWT, ItemsController.postPurchaseItem);
router.post("/active", ItemsController.postActivateItem);
router.post("/addItem", ItemsController.postAddItem);

module.exports = router;
