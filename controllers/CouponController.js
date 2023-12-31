const CouponService = require("../services/CouponService");
const ApiError = require("../utils/api-error");
const validMongoDbId = require("../utils/validMongodbId");

// Create a coupon
exports.createCoupon = async (req, res, next) => {
    try {
        const newCoupon = await CouponService.createCoupon(req.body);
        return res.status(201).json(newCoupon);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while creating a coupon")
        );
    }
};

// Update a coupon
exports.updateCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongoDbId(id);
        const data = req.body;
        const updatedCoupon = await CouponService.updateCoupon(id, data);
        return res.status(200).json(updatedCoupon);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while updating a coupon")
        );
    }
};

// Get a coupon
exports.getCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongoDbId(id);
        const getCoupon = await CouponService.getCoupon(id);
        return res.status(200).json(getCoupon);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while getting a coupon")
        );
    }
};

// Get all Coupon
exports.getAllCoupons = async (req, res, next) => {
    try {
        const getCoupons = await CouponService.getAllCoupons();
        return res.status(200).json(getCoupons);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while getting all Coupon")
        );
    }
};

// Delete a coupon
exports.deleteCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongoDbId(id);
        const deletedCoupon = await CouponService.deleteCoupon(id);
        return res.status(200).json(deletedCoupon);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while deleting a coupon")
        );
    }
};
