const express = require("express");
const router = express.Router();
const EnquiryCtrl = require("../controllers/EnquiryController");
const { authMiddleware, isAdmin } = require("../middlewares/AuthMiddleware");

router.post("/",EnquiryCtrl.createEnquiry);
router.put("/:id", authMiddleware, isAdmin, EnquiryCtrl.updateEnquiry);
router.delete("/:id", authMiddleware, isAdmin, EnquiryCtrl.deleteEnquiry);
router.get("/", EnquiryCtrl.getAllEnquiry);
router.get("/:id", EnquiryCtrl.getEnquiry);

module.exports = router;
