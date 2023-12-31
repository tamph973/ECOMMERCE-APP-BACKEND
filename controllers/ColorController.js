const ColorService = require("../services/ColorService");
const ApiError = require("../utils/api-error");
const validMongodbId = require("../utils/validMongodbId");

// Create a color
exports.createColor = async (req, res, next) => {
    try {
        const newColor = await ColorService.createColor(req.body);
        return res.status(201).json(newColor);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while creating the color")
        );
    }
};

// Update a color
exports.updateColor = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongodbId(id);
        const data = req.body;
        const updatedColor = await ColorService.updateColor(id, data);
        return res.status(200).json(updatedColor);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while updating a color")
        );
    }
};

// Deleting a color
exports.deleteColor = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongodbId(id);
        const deletedColor = await ColorService.deleteColor(id);
        return res.status(200).json(deletedColor);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while deleting a color")
        );
    }
};

// Get a color
exports.getColor = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongodbId(id);
        const getColor = await ColorService.getColor(id);
        return res.status(200).json(getColor);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while getting a color")
        );
    }
};

// Get all Color
exports.getAllColor = async (req, res, next) => {
    try {
        const getAllColor = await ColorService.getAllColor();
        return res.status(200).json(getAllColor);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while getting all Color")
        );
    }
};
