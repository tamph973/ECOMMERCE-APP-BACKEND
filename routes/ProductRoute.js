const express = require("express");
const router = express.Router();
const ProductCtrl = require("../controllers/ProductController");
const { authMiddleware, isAdmin } = require("../middlewares/AuthMiddleware");
const {
    uploadPhoto,
    productImgResize,
} = require("../middlewares/UploadImages");

router.post("/", authMiddleware, isAdmin, ProductCtrl.createProduct);
router.get("/", ProductCtrl.getAllProducts);
router.get("/:id", ProductCtrl.getProduct);
router.put(
    "/upload-img",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 10),
    productImgResize,
    ProductCtrl.uploadImages
);
router.put("/wishlist", authMiddleware, ProductCtrl.addToWishList);
router.put("/rating", authMiddleware, ProductCtrl.rating);
router.put("/:id", authMiddleware, isAdmin, ProductCtrl.updateProduct);
router.delete("/:id", authMiddleware, isAdmin, ProductCtrl.deleteProduct);
router.delete(
    "/delete-img/:id",
    authMiddleware,
    isAdmin,
    ProductCtrl.deleteImages
);

module.exports = router;
