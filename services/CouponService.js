const Coupon = require("../models/CouponModel");

class CouponService {
    // Create a Coupon
    async createCoupon(data) {
        const newCoupon = await Coupon.create(data);
        return newCoupon;
    }

    // Update a Coupon
    async updateCoupon(id, data) {
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, data, {
            new: true,
        });
        return updatedCoupon;
    }

    // Get a Coupon
    async getCoupon(id) {
        const getCoupon = await Coupon.findById(id);
        return getCoupon;
    }

    // Get all Coupon
    async getAllCoupons() {
        const getCoupons = await Coupon.find();
        return getCoupons;
    }

    // Delete a Coupon
    async deleteCoupon(id) {
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        return deletedCoupon;
    }
}

module.exports = new CouponService();
