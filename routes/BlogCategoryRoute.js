const express = require("express");
const router = express.Router();
const BCategoryCtrl = require("../controllers/BlogCategoryController");
const { authMiddleware, isAdmin } = require("../middlewares/AuthMiddleware");

router.post("/", authMiddleware, isAdmin, BCategoryCtrl.createBCategory);
router.put("/:id", authMiddleware, isAdmin, BCategoryCtrl.updateBCategory);
router.delete("/:id", authMiddleware, isAdmin, BCategoryCtrl.deleteBCategory);
router.get("/", BCategoryCtrl.getAllBCategory);
router.get("/:id", BCategoryCtrl.getBCategory);

module.exports = router;
