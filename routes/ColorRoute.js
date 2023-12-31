const express = require("express");
const router = express.Router();
const ColorCtrl = require("../controllers/ColorController");
const { authMiddleware, isAdmin } = require("../middlewares/AuthMiddleware");

router.post("/", authMiddleware, isAdmin, ColorCtrl.createColor);
router.put("/:id", authMiddleware, isAdmin, ColorCtrl.updateColor);
router.delete("/:id", authMiddleware, isAdmin, ColorCtrl.deleteColor);
router.get("/", ColorCtrl.getAllColor);
router.get("/:id", ColorCtrl.getColor);

module.exports = router;
