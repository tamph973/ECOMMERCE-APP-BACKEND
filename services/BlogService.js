const Blog = require("../models/BlogModel");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");
class BlogService {
    // Create a blog
    async createBlog(data) {
        const newBlog = await Blog.create(data);
        return newBlog;
    }

    // Update a blog
    async updateBlog(id, data) {
        const updatedBlog = await Blog.findByIdAndUpdate(id, data, {
            new: true,
        });
        return updatedBlog;
    }

    // Get a blog
    async getBlog(id) {
        const getBlog = await Blog.findById(id)
            .populate("likes")
            .populate("dislikes");
        await Blog.findByIdAndUpdate(
            id,
            { $inc: { numberViews: 1 } },
            { new: true }
        );
        return getBlog;
    }

    // Get all blog
    async getAllBlogs() {
        const getBlogs = await Blog.find();
        return getBlogs;
    }

    // Delete all blog
    async deleteBlog(id) {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        return deletedBlog;
    }

    // Like a blog
    async likeBlog(blogId, userId) {
        // Find the blog which you want to be liked
        const blog = await Blog.findById(blogId);
        // Find the login user
        const loginUserId = userId;
        // Find if the user has liked the blog
        const isLiked = blog?.isLiked;
        // Find if the user has disliked the blog
        const alreadyDisliked = blog?.dislikes?.find(
            (uid) => uid?.toString() === loginUserId?.toString()
        );
        // If the blog already disliked
        if (alreadyDisliked) {
            const updateBlog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    $pull: { dislikes: loginUserId },
                    isDisliked: false,
                },
                { new: true }
            );
            return updateBlog;
        }

        // If the blog already liked
        if (isLiked) {
            const updateBlog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    $pull: { likes: loginUserId },
                    isLiked: false,
                },
                { new: true }
            );
            return updateBlog;
        }
        // If the blog hasn't already liked
        else {
            const updateBlog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    $push: { likes: loginUserId },
                    isLiked: true,
                },
                { new: true }
            );
            return updateBlog;
        }
    }

    // Dislike a blog
    async dislikeBlog(blogId, userId) {
        // Find the blog which you want to be liked
        const blog = await Blog.findById(blogId);
        // Find the login user
        const loginUserId = userId;
        // Find if the user has disliked the blog
        const isDisliked = blog?.isDisliked;
        // Find if the user has liked the blog
        const alreadyLiked = blog?.likes?.find(
            (uid) => uid?.toString() === loginUserId?.toString()
        );
        // If the blog already liked
        if (alreadyLiked) {
            const updateBlog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    $pull: { likes: loginUserId },
                    isLiked: false,
                },
                { new: true }
            );
            return updateBlog;
        }

        // If the blog already disliked
        if (isDisliked) {
            const updateBlog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    $pull: { dislikes: loginUserId },
                    isDisliked: false,
                },
                { new: true }
            );
            return updateBlog;
        }
        // If the blog hasn't already disliked
        else {
            const updateBlog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    $push: { dislikes: loginUserId },
                    isDisliked: true,
                },
                { new: true }
            );
            return updateBlog;
        }
    }

    // Upload images
    async uploadImages(pid, files) {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            // fs.unlinkSync(path);
        }

        const findBlog = await Blog.findByIdAndUpdate(
            pid,
            {
                images: urls.map((file) => {
                    return file;
                }),
            },
            { new: true }
        );

        return findBlog;
    }
}

module.exports = new BlogService();
