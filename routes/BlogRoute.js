const express = require("express");
const router = express.Router();
const BlogCtrl = require("../controllers/BlogController");
const { authMiddleware, isAdmin } = require("../middlewares/AuthMiddleware");
const { uploadPhoto, blogImgResize } = require("../middlewares/UploadImages");

router.post("/", authMiddleware, isAdmin, BlogCtrl.createBlog);
router.put(
    "/upload-img/:id",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 2),
    blogImgResize,
    BlogCtrl.uploadImages
);
router.put("/likes", authMiddleware, BlogCtrl.likeBlog);
router.put("/dislikes", authMiddleware, BlogCtrl.dislikeBlog);
router.put("/:id", authMiddleware, isAdmin, BlogCtrl.updateBlog);
router.get("/:id", BlogCtrl.getBlog);
router.get("/", BlogCtrl.getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, BlogCtrl.deleteBlog);

module.exports = router;
