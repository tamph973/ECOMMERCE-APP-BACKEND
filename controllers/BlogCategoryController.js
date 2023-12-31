const BCategoryService = require("../services/BlogCategoryService");
const ApiError = require("../utils/api-error");
const validMongodbId = require("../utils/validMongodbId");

// Create a blog category
exports.createBCategory = async (req, res, next) => {
    try {
        const newBCategory = await BCategoryService.createBCategory(req.body);
        return res.status(201).json(newBCategory);
    } catch (err) {
        return next(
            new ApiError(
                500,
                "An error occurred while creating the blog category"
            )
        );
    }
};

// Update a blog category
exports.updateBCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongodbId(id);
        const data = req.body;
        const updatedBCategory = await BCategoryService.updateBCategory(
            id,
            data
        );
        return res.status(200).json(updatedBCategory);
    } catch (err) {
        return next(
            new ApiError(
                500,
                "An error occurred while updating a blog category"
            )
        );
    }
};

// Deleting a blog category
exports.deleteBCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongodbId(id);
        const deletedBCategory = await BCategoryService.deleteBCategory(id);
        return res.status(200).json(deletedBCategory);
    } catch (err) {
        return next(
            new ApiError(
                500,
                "An error occurred while deleting a blog category"
            )
        );
    }
};

// Get a blog category
exports.getBCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongodbId(id);
        const getBCategory = await BCategoryService.getBCategory(id);
        return res.status(200).json(getBCategory);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while getting a blog category")
        );
    }
};

// Get all blog category
exports.getAllBCategory = async (req, res, next) => {
    try {
        const getAllBCategory = await BCategoryService.getAllBCategory();
        return res.status(200).json(getAllBCategory);
    } catch (err) {
        return next(
            new ApiError(
                500,
                "An error occurred while getting all blog category"
            )
        );
    }
};
