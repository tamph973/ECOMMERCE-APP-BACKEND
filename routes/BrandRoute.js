const express = require("express");
const router = express.Router();
const BrandCtrl = require("../controllers/BrandController");
const { authMiddleware, isAdmin } = require("../middlewares/AuthMiddleware");

router.post("/", authMiddleware, isAdmin, BrandCtrl.createBrand);
router.put("/:id", authMiddleware, isAdmin, BrandCtrl.updateBrand);
router.delete("/:id", authMiddleware, isAdmin, BrandCtrl.deleteBrand);
router.get("/", BrandCtrl.getAllBrand);
router.get("/:id", BrandCtrl.getBrand);

module.exports = router;
