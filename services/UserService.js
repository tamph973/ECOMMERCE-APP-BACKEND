const { sendEmail } = require("../controllers/EmailController");
const User = require("../models/UserModel");
const Cart = require("../models/CartModel");
const Coupon = require("../models/CouponModel");
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const ApiError = require("../utils/api-error");
const crypto = require("crypto");
const uniqid = require("uniqid");

class UserService {
    // Create a user
    async createUser(data) {
        // Check user exists
        const findUser = await User.findOne({ email: data.email });
        if (findUser) {
            throw new ApiError(200, "User already exists");
        }
        const newUser = await User.create(data);
        return newUser;
    }

    // Update a user
    async updateUser(id, data) {
        const userUpdate = await User.findByIdAndUpdate(
            id,
            {
                firstname: data?.firstname,
                lastname: data?.lastname,
                email: data?.email,
                mobile: data?.mobile,
            },
            { new: true }
        );
        return userUpdate;
    }
    // Get all users
    async getAllUsers() {
        const allUsers = await User.find();
        return allUsers;
    }

    // Get a single user
    async getUser(id) {
        const user = await User.findById(id);
        return user;
    }
    // Delete a user
    async deleteUser(id) {
        const deleteUser = await User.findByIdAndDelete(id);
        return deleteUser;
    }

    // Block user
    async blockUser(id) {
        const blockedUser = await User.findByIdAndUpdate(
            id,
            { isBlocked: true },
            { new: true }
        );
        return blockedUser;
    }

    // Unblock user
    async unblockUser(id) {
        const unblockUser = await User.findByIdAndUpdate(
            id,
            { isBlocked: false },
            { new: true }
        );
        return unblockUser;
    }

    // Update password
    async updatePassword(id, password) {
        const user = await User.findById(id);
        if (password) {
            user.password = password;
            const updatedPassword = await user.save();
            return updatedPassword;
        } else {
            return user;
        }
    }

    // Forgot password
    async forgotPasswordToken(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(400, "User not found with this email");
        }
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset your password. This link is valid till 30 minutes from now. <a href='http://localhost:3000/api/users/reset-password/${token}'>Click here</a>`;
        const data = {
            to: email,
            subject: "Forgot password link",
            text: "Hey user",
            html: resetURL,
        };
        sendEmail(data);
        console.log(data);
        return token;
    }

    // Reset password
    async resetPassword(password, token) {
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!user) {
            throw new ApiError(400, "Token expired, Please try again later");
        }
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        return user;
    }

    // Get wishlist
    async getWishList(uid) {
        const findUser = await User.findById(uid).populate("wishList");
        return findUser;
    }

    // Save user address
    async saveAddress(uid, address) {
        const updatedAddress = await User.findByIdAndUpdate(
            uid,
            {
                address: address,
            },
            { new: true }
        );
        return updatedAddress;
    }

    // Create user cart
    async userCart(uid, cart) {
        let products = [];
        const user = await User.findById(uid);
        const alreadyExistCart = await Cart.findOne({ orderby: user._id });
        if (alreadyExistCart) {
            alreadyExistCart.remove();
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id)
                .select("price")
                .exec();
            object.price = getPrice.price;
            products.push(object);
        }
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal += products[i].price * products[i].count;
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id,
        }).save();
        return newCart;
    }

    // Get user cart
    async getUserCart(uid) {
        const cart = await Cart.findOne({ orderby: uid }).populate(
            "products.product"
        );
        return cart;
    }

    // Empty cart
    async emptyCart(uid) {
        const cart = await Cart.findOneAndDelete({ orderby: uid });
        return cart;
    }

    // Apply coupon
    async applyCoupon(coupon, uid) {
        const validCoupon = await Coupon.findOne({ name: coupon });
        if (validCoupon === null) {
            throw new ApiError(400, "Invaid coupon");
        }

        let { cartTotal } = await Cart.findOne({
            orderby: uid,
        }).populate("products.product");
        let totalAfterDiscount = (
            cartTotal -
            (cartTotal * validCoupon.discount) / 100
        ).toFixed(2);
        await Cart.findOneAndUpdate(
            { orderby: uid },
            {
                totalAfterDiscount,
            },
            { new: true }
        );
        return totalAfterDiscount;
    }

    // Create order
    async createOrder(COD, couponApplied, uid) {
        if (!COD) {
            throw new ApiError(400, "Create cash order failed");
        }
        const user = await User.findById(uid);
        let userCart = await Cart.findOne({ orderby: user._id });
        let finalAmount = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount;
        } else {
            finalAmount = userCart.cartTotal;
        }

        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "VND",
            },
            orderby: user._id,
            orderStatus: "Cash on Delivery",
        }).save();

        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: {
                        _id: item.product._id,
                    },
                    update: {
                        $inc: { quantity: -item.count, sold: +item.count },
                    },
                },
            };
        });
        const updated = await Product.bulkWrite(update, {});
        return updated;
    }

    // Get user order
    async getOrder(uid) {
        const order = await Order.findOne({ orderby: uid }).populate(
            "products.product"
        );
        return order;
    }

    // Update  orders status
    async updateOrderStatus(id, status) {
        const orderStatus = await Order.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                paymentIntent: {
                    status: status,
                },
            },
            { new: true }
        );
        return orderStatus;
    }
}
module.exports = new UserService();
