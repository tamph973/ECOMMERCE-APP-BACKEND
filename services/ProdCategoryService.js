const PCategory = require("../models/ProdCategoryModel");

class PCategoryService {
    // Create a product category
    async createPCategory(data) {
        const newPCategory = await PCategory.create(data);
        return newPCategory;
    }

    // Update a product category
    async updatePCategory(id, data) {
        const updatedPCategory = await PCategory.findByIdAndUpdate(id, data, {
            new: true,
        });
        return updatedPCategory;
    }

    // Get a product category
    async getPCategory(id) {
        const getPCategory = await PCategory.findById(id);
        return getPCategory;
    }

    // Get a product category
    async getAllPCategory() {
        const getAllPCategory = await PCategory.find();
        return getAllPCategory;
    }

    // Delete a product category
    async deletePCategory(id) {
        const deletedPCategory = await PCategory.findByIdAndDelete(id);
        return deletedPCategory;
    }
}

module.exports = new PCategoryService();
