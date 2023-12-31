const EnquiryService = require("../services/EnquiryService");
const ApiError = require("../utils/api-error");
const validMongodbId = require("../utils/validMongodbId");

// Create a Enquiry
exports.createEnquiry = async (req, res, next) => {
    try {
        const newEnquiry = await EnquiryService.createEnquiry(req.body);
        return res.status(201).json(newEnquiry);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while creating the Enquiry")
        );
    }
};

// Update a Enquiry
exports.updateEnquiry = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongodbId(id);
        const data = req.body;
        const updatedEnquiry = await EnquiryService.updateEnquiry(id, data);
        return res.status(200).json(updatedEnquiry);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while updating a Enquiry")
        );
    }
};

// Deleting a Enquiry
exports.deleteEnquiry = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongodbId(id);
        const deletedEnquiry = await EnquiryService.deleteEnquiry(id);
        return res.status(200).json(deletedEnquiry);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while deleting a Enquiry")
        );
    }
};

// Get a Enquiry
exports.getEnquiry = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongodbId(id);
        const getEnquiry = await EnquiryService.getEnquiry(id);
        return res.status(200).json(getEnquiry);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while getting a Enquiry")
        );
    }
};

// Get all Enquiry
exports.getAllEnquiry = async (req, res, next) => {
    try {
        const getAllEnquiry = await EnquiryService.getAllEnquiry();
        return res.status(200).json(getAllEnquiry);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while getting all Enquiry")
        );
    }
};
