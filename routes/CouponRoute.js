const express = require("express");
const router = express.Router();
const CouponCtrl = require("../controllers/CouponController");
const { authMiddleware, isAdmin } = require("../middlewares/AuthMiddleware");

router.post("/", authMiddleware, isAdmin, CouponCtrl.createCoupon);
router.get("/", authMiddleware, isAdmin, CouponCtrl.getAllCoupons);
router.put("/:id", authMiddleware, isAdmin, CouponCtrl.updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, CouponCtrl.deleteCoupon);
router.get("/:id", CouponCtrl.getCoupon);

module.exports = router;
