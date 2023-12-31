const BlogService = require("../services/BlogService");
const ApiError = require("../utils/api-error");
const validMongoDbId = require("../utils/validMongodbId");

// Create a blog
exports.createBlog = async (req, res, next) => {
    try {
        const newBlog = await BlogService.createBlog(req.body);
        return res.status(201).json(newBlog);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while creating a blog")
        );
    }
};

// Update a blog
exports.updateBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongoDbId(id);
        const data = req.body;
        const updatedBlog = await BlogService.updateBlog(id, data);
        return res.status(200).json(updatedBlog);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while updating a blog")
        );
    }
};

// Get a blog
exports.getBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongoDbId(id);
        const getBlog = await BlogService.getBlog(id);
        return res.status(200).json(getBlog);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while getting a blog")
        );
    }
};

// Get all blog
exports.getAllBlogs = async (req, res, next) => {
    try {
        const getBlogs = await BlogService.getAllBlogs();
        return res.status(200).json(getBlogs);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while getting all blog")
        );
    }
};

// Delete a blog
exports.deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        validMongoDbId(id);
        const deletedBlog = await BlogService.deleteBlog(id);
        return res.status(200).json(deletedBlog);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while deleting a blog")
        );
    }
};

// Like a blog
exports.likeBlog = async (req, res, next) => {
    try {
        const { blogId } = req.body;
        validMongoDbId(blogId);
        const userId = req?.user?._id;
        const likedBlog = await BlogService.likeBlog(blogId, userId);
        return res.status(200).json(likedBlog);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while deleting a blog")
        );
    }
};

// Dislike a blog
exports.dislikeBlog = async (req, res, next) => {
    try {
        const { blogId } = req.body;
        validMongoDbId(blogId);
        const userId = req?.user?._id;
        const dislikedBlog = await BlogService.dislikeBlog(blogId, userId);
        return res.status(200).json(dislikedBlog);
    } catch (err) {
        return next(
            new ApiError(500, "An error occurred while deleting a blog")
        );
    }
};


// Upload images
exports.uploadImages = async (req, res, next) => {
    try {
        const { id } = req.params; // pid
        validMongoDbId(id);
        const files = req.files;
        const uploadImages = await BlogService.uploadImages(id, files);
        return res.status(200).json(uploadImages);
    } catch (err) {
        return next(
            new ApiError(
                500,
                "An error occurred while uploading blog images"
            )
        );
    }
}