const BCategory = require("../models/BlogCategoryModel");

class BCategoryService {
    // Create a blog category
    async createBCategory(data) {
        const newBCategory = await BCategory.create(data);
        return newBCategory;
    }

    // Update a blog category
    async updateBCategory(id, data) {
        const updatedBCategory = await BCategory.findByIdAndUpdate(id, data, {
            new: true,
        });
        return updatedBCategory;
    }

    // Get a blog category
    async getBCategory(id) {
        const getBCategory = await BCategory.findById(id);
        return getBCategory;
    }

    // Get a blog category
    async getAllBCategory() {
        const getAllBCategory = await BCategory.find();
        return getAllBCategory;
    }

    // Delete a blog category
    async deleteBCategory(id) {
        const deletedBCategory = await BCategory.findByIdAndDelete(id);
        return deletedBCategory;
    }
}

module.exports = new BCategoryService();
