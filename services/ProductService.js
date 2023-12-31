const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const ApiError = require("../utils/api-error");
const {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const fs = require("fs");
class ProductService {
    // Create a product
    async createProduct(data) {
        const newProduct = await Product.create(data);
        return newProduct;
    }

    // Update a product
    async updateProduct(id, data) {
        const updatedProduct = await Product.findByIdAndUpdate(id, data, {
            new: true,
        });
        return updatedProduct;
    }
    // Get all products
    async getAllProducts(queryObj, query) {
        // Filter product
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        // console.log(query);
        // console.log(queryObj);
        // console.log(queryStr);
        let queryProduct = Product.find(JSON.parse(queryStr));

        // Sorting product
        if (query.sort) {
            const sortBy = query.sort.split(",").join(" ");
            queryProduct = queryProduct.sort(sortBy);
        } else {
            queryProduct = queryProduct.sort("-createdAt");
        }

        // Limiting the fields
        if (query.fields) {
            const fields = query.fields.split(",").join(" ");
            queryProduct = queryProduct.select(fields);
        } else {
            queryProduct = queryProduct.select("-__v");
        }

        // Pagination
        const page = query.page;
        const limit = query.limit;
        const skip = (page - 1) * limit;
        queryProduct = queryProduct.skip(skip).limit(limit);
        if (query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) {
                throw new ApiError(500, "This page is not exists");
            }
        }
        console.log(page, limit, skip);
        const product = await queryProduct;
        return product;
    }

    // Get a single product
    async getProduct(id) {
        const product = await Product.findById(id);
        return product;
    }

    // Delete a product
    async deleteProduct(id) {
        const deletedProduct = await Product.findByIdAndDelete(id);
        return deletedProduct;
    }

    // Add product to wish list
    async addToWishList(uid, prodId) {
        const user = await User.findById(uid);
        const alreadyAdded = user.wishList.find(
            (id) => id.toString() === prodId
        );
        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(
                uid,
                {
                    $pull: { wishList: prodId },
                },
                { new: true }
            );
            return user;
        } else {
            let user = await User.findByIdAndUpdate(
                uid,
                {
                    $push: { wishList: prodId },
                },
                { new: true }
            );
            return user;
        }
    }

    async rating(uid, pid, star, comment) {
        const product = await Product.findById(pid);
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === uid.toString()
        );

        if (alreadyRated) {
            await Product.updateOne(
                { ratings: { $elemMatch: alreadyRated } },
                {
                    $set: {
                        "ratings.$.star": star,
                        "ratings.$.comment": comment,
                    },
                },
                { new: true }
            );
        } else {
            await Product.findByIdAndUpdate(
                pid,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: uid,
                        },
                    },
                },
                { new: true }
            );
        }
        const getAllRatings = await Product.findById(pid);
        let totalRating = getAllRatings.ratings.length;
        let sumRating = getAllRatings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(sumRating / totalRating);
        const ratedProduct = await Product.findByIdAndUpdate(
            pid,
            { totalRating: actualRating },
            { new: true }
        );

        return ratedProduct;
    }

    // Upload images
    async uploadImages(files) {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            // fs.unlinkSync(path); error
        }

        const images = urls.map((file) => {
            return file;
        });

        return images;
    }

    // Delete images
    async deleteImages(id) {
        const deleted = cloudinaryDeleteImg(id, "images");
        return deleted;
    }
}

module.exports = new ProductService();
