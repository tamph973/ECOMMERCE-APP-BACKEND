const UserService = require("../services/UserService");
const User = require("../models/UserModel");
const ApiError = require("../utils/api-error");
const validMongoDbId = require("../utils/validMongodbId");
const JWTService = require("../services/JWTService");
// Create a user
exports.createUser = async (req, res, next) => {
    try {
        const userCreated = await UserService.createUser(req.body);
        return res.status(201).json(userCreated);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while creating the user")
        );
    }
};

// Login a user
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const findUser = await User.findOne({ email });

        if (findUser && (await findUser.isPasswordMatched(password))) {
            const refreshToken = await JWTService.generalRefreshToken(
                findUser?.id
            );
            await User.findByIdAndUpdate(
                findUser.id,
                { refresh_token: refreshToken },
                { new: true }
            );

            // Set the refresh token cookie
            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });

            // Send the user data and access token
            res.json({
                _id: findUser?._id,
                firstname: findUser?.firstname,
                lastname: findUser?.lastname,
                email: findUser?.email,
                mobile: findUser?.mobile,
                access_token: await JWTService.generalAccessToken(
                    findUser?._id
                ),
            });
        } else {
            throw new ApiError(400, "Invalid Credentials");
        }
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while login the user")
        );
    }
};

// Login admin
exports.loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const findAdmin = await User.findOne({ email });

        if (findAdmin.role !== "admin") {
            throw new ApiError(400, "Not authorised");
        }

        if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
            const refreshToken = await JWTService.generalRefreshToken(
                findAdmin?.id
            );
            await User.findByIdAndUpdate(
                findAdmin.id,
                { refresh_token: refreshToken },
                { new: true }
            );

            // Set the refresh token cookie
            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });

            // Send the Admin data and access token
            res.json({
                _id: findAdmin?._id,
                firstname: findAdmin?.firstname,
                lastname: findAdmin?.lastname,
                email: findAdmin?.email,
                mobile: findAdmin?.mobile,
                access_token: await JWTService.generalAccessToken(
                    findAdmin?._id
                ),
            });
        } else {
            throw new ApiError(400, "Invalid Credentials");
        }
    } catch (err) {
        console.log(err);
        return next(
            new ApiError(500, "An error occurred while login as admin")
        );
    }
};

// Handle refresh token
exports.refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            throw new ApiError(400, "No refresh token in cookies");
        }
        const user = await User.findOne({ refresh_token: refreshToken });
        if (!user) {
            throw new ApiError(
                400,
                "No refresh token present in database or not  matched"
            );
        }
        const newToken = await JWTService.refreshTokenService(refreshToken);
        return res.status(200).json(newToken);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while refreshing token")
        );
    }
};

// Logout user
exports.logoutUser = async (req, res, next) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        throw new ApiError(400, "No refresh token in cookies");
    }
    const user = await User.findOne({ refresh_token: refreshToken });
    if (!user) {
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate(
        { refresh_token: refreshToken },
        {
            refresh_token: "",
        }
    );
    res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);
};
// Update a user
exports.updateUser = async (req, res, next) => {
    try {
        const { _id } = req.user;
        validMongoDbId(_id);
        const dataUpdate = req.body;
        const userUpdate = await UserService.updateUser(_id, dataUpdate);
        return res.status(200).json(userUpdate);
    } catch (err) {
        console.log(err);
        return next(
            new ApiError(500, "An error occurred while updating a user")
        );
    }
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await UserService.getAllUsers();
        return res.status(200).json(allUsers);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while getting all user")
        );
    }
};

// Get a single user
exports.getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongoDbId(id);
        const user = await UserService.getUser(id);
        console.log(user);
        // return res.status(200).json(user);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while getting a single user")
        );
    }
};

// Delete a user
exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongoDbId(id);
        const deleteUser = await UserService.deleteUser(id);
        return res.status(200).json(deleteUser);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while deleting a user")
        );
    }
};

// Block user
exports.blockUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongoDbId(id);
        const blockedUser = await UserService.blockUser(id);
        return res
            .status(200)
            .json({ message: "User is blocked", blockedUser });
    } catch (err) {
        console.log(err);
        return next(new ApiError(500, "An error occurred while block a user"));
    }
};

// Unblock user
exports.unblockUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongoDbId(id);

        const unblockUser = await UserService.unblockUser(id);
        return res
            .status(200)
            .json({ message: "User is unblock", unblockUser });
    } catch (err) {
        console.log(err);
        return next(
            new ApiError(500, "An error occurred while unblock a user")
        );
    }
};

// Update password
exports.updatePassword = async (req, res, next) => {
    try {
        const { _id } = req.user;
        validMongoDbId(_id);

        const { password } = req.body;
        const updatedPassword = await UserService.updatePassword(_id, password);
        return res.status(200).json(updatedPassword);
    } catch (err) {
        console.log(err);
        return next(
            new ApiError(500, "An error occurred while change password")
        );
    }
};

// Forgot password
exports.forgotPasswordToken = async (req, res, next) => {
    try {
        const { email } = req.body;
        const forgotPassword = await UserService.forgotPasswordToken(email);
        return res.status(200).json(forgotPassword);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while change password")
        );
    }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        const { token } = req.params;
        const resetPassword = await UserService.resetPassword(password, token);
        return res.status(200).json(resetPassword);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while change password")
        );
    }
};

// Get a wishlist
exports.getWishList = async (req, res, next) => {
    try {
        const { _id } = req.user;
        validMongoDbId(_id);
        const getWishList = await UserService.getWishList(_id);
        return res.status(200).json(getWishList);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while change password")
        );
    }
};

// Save user address
exports.saveAddress = async (req, res, next) => {
    try {
        const { _id } = req.user;
        validMongoDbId(_id);
        const { address } = req.body;
        const savedAddress = await UserService.saveAddress(_id, address);
        return res.status(200).json(savedAddress);
    } catch (err) {
        return next(new ApiError(500, "An error occurred while save address"));
    }
};

// Create user cart
exports.userCart = async (req, res, next) => {
    try {
        const { _id } = req.user;
        validMongoDbId(_id);
        const { cart } = req.body;
        const userCart = await UserService.userCart(_id, cart);
        return res.status(200).json(userCart);
    } catch (err) {
        return next(new ApiError(500, "An error occurred while add to cart"));
    }
};

// Get user cart
exports.getUserCart = async (req, res, next) => {
    try {
        const { _id } = req.user;
        validMongoDbId(_id);
        const userCart = await UserService.getUserCart(_id);
        return res.status(200).json(userCart);
    } catch (err) {
        return next(new ApiError(500, "An error occurred while get user cart"));
    }
};

// Empty cart
exports.emptyCart = async (req, res, next) => {
    try {
        const { _id } = req.user;
        validMongoDbId(_id);
        const cart = await UserService.emptyCart(_id);
        return res.status(200).json(cart);
    } catch (err) {
        return next(new ApiError(500, "An error occurred while get user cart"));
    }
};

// Apply coupon
exports.applyCoupon = async (req, res, next) => {
    try {
        const { _id } = req.user;
        validMongoDbId(_id);
        const { coupon } = req.body;

        const applyedCoupon = await UserService.applyCoupon(coupon, _id);
        return res.status(200).json(applyedCoupon);
    } catch (err) {
        console.log(err);
        return next(new ApiError(500, "An error occurred while apply coupon"));
    }
};

// Create order
exports.createOrder = async (req, res, next) => {
    try {
        const { _id } = req.user;
        validMongoDbId(_id);
        const { COD, couponApplied } = req.body;

        const newOrder = await UserService.createOrder(COD, couponApplied, _id);
        return res.status(200).json({ message: "Success" });
    } catch (err) {
        console.log(err);
        return next(new ApiError(500, "An error occurred while create order"));
    }
};

// Get order
exports.getOrder = async (req, res, next) => {
    try {
        const { _id } = req.user;
        validMongoDbId(_id);
        const userOrder = await UserService.getOrder(_id);
        return res.status(200).json(userOrder);
    } catch (err) {
        console.log(err);
        return next(new ApiError(500, "An error occurred while get order"));
    }
};

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        validMongoDbId(id);
        const updateStatus = await UserService.updateOrderStatus(id, status);
        return res.status(200).json(updateStatus);
    } catch (err) {
        console.log(err);
        return next(new ApiError(500, "An error occurred while get order"));
    }
};
