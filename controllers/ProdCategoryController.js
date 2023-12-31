const PCategoryService = require("../services/ProdCategoryService");
const ApiError = require("../utils/api-error");
const validMongodbId = require("../utils/validMongodbId");

// Create a product category
exports.createPCategory = async (req, res, next) => {
    try {
        const newPCategory = await PCategoryService.createPCategory(req.body);
        return res.status(201).json(newPCategory);
    } catch (err) {
        return next(
            new ApiError(
                500,
                "An error occurred while creating the product category"
            )
        );
    }
};

// Update a product category
exports.updatePCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongodbId(id);
        const data = req.body;
        const updatedPCategory = await PCategoryService.updatePCategory(
            id,
            data
        );
        return res.status(200).json(updatedPCategory);
    } catch (err) {
        return next(
            new ApiError(
                500,
                "An error occurred while updating a product category"
            )
        );
    }
};

// Deleting a product category
exports.deletePCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongodbId(id);
        const deletedPCategory = await PCategoryService.deletePCategory(id);
        return res.status(200).json(deletedPCategory);
    } catch (err) {
        return next(
            new ApiError(
                500,
                "An error occurred while deleting a product category"
            )
        );
    }
};

// Get a product category
exports.getPCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongodbId(id);
        const getPCategory = await PCategoryService.getPCategory(id);
        return res.status(200).json(getPCategory);
    } catch (err) {
        return next(
            new ApiError(
                500,
                "An error occurred while getting a product category"
            )
        );
    }
};

// Get all product category
exports.getAllPCategory = async (req, res, next) => {
    try {
        const getAllPCategory = await PCategoryService.getAllPCategory();
        return res.status(200).json(getAllPCategory);
    } catch (err) {
        return next(
            new ApiError(
                500,
                "An error occurred while getting all product category"
            )
        );
    }
};
