const express = require("express");
const router = express.Router();
const UserCtrl = require("../controllers/UserController");
const { authMiddleware, isAdmin } = require("../middlewares/AuthMiddleware");

router.post("/register", UserCtrl.createUser);
router.post("/login", UserCtrl.loginUser);
router.post("/admin-login", UserCtrl.loginAdmin);
router.post("/cart", authMiddleware, UserCtrl.userCart);
router.post("/refresh-token", UserCtrl.refreshToken);
router.post("/logout", UserCtrl.logoutUser);
router.post("/forgot-password-token", UserCtrl.forgotPasswordToken);
router.post("/cart/apply-coupon", authMiddleware, UserCtrl.applyCoupon);
router.post("/cart/cash-order", authMiddleware, UserCtrl.createOrder);
router.put("/password", authMiddleware, UserCtrl.updatePassword);
router.put(
    "/order/update-status/:id",
    authMiddleware,
    isAdmin,
    UserCtrl.updateOrderStatus
);
router.put("/reset-password/:token", UserCtrl.resetPassword);

router.get("/", UserCtrl.getAllUsers);
router.get("/wishlist", authMiddleware, UserCtrl.getWishList);
router.get("/cart", authMiddleware, UserCtrl.getUserCart);
router.get("/get-order", authMiddleware, UserCtrl.getOrder);
router.get("/:id", authMiddleware, isAdmin, UserCtrl.getUser);
router.put("/edit-user", authMiddleware, UserCtrl.updateUser);
router.put("/save-address", authMiddleware, UserCtrl.saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, UserCtrl.blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, UserCtrl.unblockUser);
router.delete("/empty-cart", authMiddleware, UserCtrl.emptyCart);
router.delete("/:id", UserCtrl.deleteUser);

module.exports = router;
