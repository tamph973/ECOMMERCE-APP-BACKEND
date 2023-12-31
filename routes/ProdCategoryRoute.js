const express = require("express");
const router = express.Router();
const PCategoryCtrl = require("../controllers/ProdCategoryController");
const { authMiddleware, isAdmin } = require("../middlewares/AuthMiddleware");

router.post("/", authMiddleware, isAdmin, PCategoryCtrl.createPCategory);
router.put("/:id", authMiddleware, isAdmin, PCategoryCtrl.updatePCategory);
router.delete("/:id", authMiddleware, isAdmin, PCategoryCtrl.deletePCategory);
router.get("/", PCategoryCtrl.getAllPCategory);
router.get("/:id", PCategoryCtrl.getPCategory);

module.exports = router;
