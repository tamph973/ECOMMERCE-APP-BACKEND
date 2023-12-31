const BrandService = require("../services/BrandService");
const ApiError = require("../utils/api-error");
const validMongodbId = require("../utils/validMongodbId");

// Create a brand
exports.createBrand = async (req, res, next) => {
    try {
        const newBrand = await BrandService.createBrand(req.body);
        return res.status(201).json(newBrand);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while creating the brand")
        );
    }
};

// Update a brand
exports.updateBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongodbId(id);
        const data = req.body;
        const updatedBrand = await BrandService.updateBrand(id, data);
        return res.status(200).json(updatedBrand);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while updating a brand")
        );
    }
};

// Deleting a brand
exports.deleteBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongodbId(id);
        const deletedBrand = await BrandService.deleteBrand(id);
        return res.status(200).json(deletedBrand);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while deleting a brand")
        );
    }
};

// Get a brand
exports.getBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongodbId(id);
        const getBrand = await BrandService.getBrand(id);
        return res.status(200).json(getBrand);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while getting a brand")
        );
    }
};

// Get all brand
exports.getAllBrand = async (req, res, next) => {
    try {
        const getAllBrand = await BrandService.getAllBrand();
        return res.status(200).json(getAllBrand);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while getting all brand")
        );
    }
};
