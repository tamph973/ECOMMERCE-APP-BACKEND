const ProductService = require("../services/ProductService");
const ApiError = require("../utils/api-error");
const slugify = require("slugify");
const validMongoDbId = require("../utils/validMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");
const Product = require("../models/ProductModel");
// Create a product
exports.createProduct = async (req, res, next) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await ProductService.createProduct(req.body);
        return res.status(201).json(newProduct);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while creating the product")
        );
    }
};

// Update a product
exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongoDbId(id);
        const data = req.body;
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await ProductService.updateProduct(id, data);
        return res.status(200).json(updatedProduct);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while deleting a product")
        );
    }
};
// Delete a product
exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongoDbId(id);
        const deltedProduct = await ProductService.deleteProduct(id);
        return res.status(200).json(deltedProduct);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while deleting a product")
        );
    }
};

// Get a product
exports.getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongoDbId(id);
        const product = await ProductService.getProduct(id);
        return res.status(200).json(product);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while getting a product")
        );
    }
};

// Get all products
exports.getAllProducts = async (req, res, next) => {
    try {
        const query = req.query;
        const queryObj = { ...req.query }; // returns fields that are not included ["page", "sort", "limit", "fields"]

        const product = await ProductService.getAllProducts(queryObj, query);

        return res.status(200).json(product);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while getting all product")
        );
    }
};

// Add product to wish list
exports.addToWishList = async (req, res, next) => {
    try {
        const { _id } = req.user;
        validMongoDbId(_id);
        const { prodId } = req.body;
        const wishList = await ProductService.addToWishList(_id, prodId);
        return res.status(200).json(wishList);
    } catch (err) {
        console.log(err);
        return next(
            new ApiError(
                500,
                "An error occurred while add product to wish list"
            )
        );
    }
};

// Add product to wish list
exports.rating = async (req, res, next) => {
    try {
        const { _id } = req.user;
        validMongoDbId(_id);
        const { star, prodId, comment } = req.body;
        const rating = await ProductService.rating(_id, prodId, star, comment);
        return res.status(200).json(rating);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while rating the product")
        );
    }
};

// Upload images
exports.uploadImages = async (req, res, next) => {
    try {
        const files = req.files;
        const uploadImages = await ProductService.uploadImages(files);
        return res.status(200).json(uploadImages);
    } catch (err) {
        console.log(err);
        return next(
            new ApiError(
                500,
                "An error occurred while uploading product images"
            )
        );
    }
};

// Delete images
exports.deleteImages = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleteImages = await ProductService.deleteImages(id);
        return res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        console.log(err);
        return next(
            new ApiError(
                500,
                "An error occurred while uploading product images"
            )
        );
    }
};
