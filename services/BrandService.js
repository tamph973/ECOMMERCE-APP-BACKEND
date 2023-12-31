const Brand = require("../models/BrandModel");

class BrandService {
    // Create a brand
    async createBrand(data) {
        const newBrand = await Brand.create(data);
        return newBrand;
    }

    // Update a brand
    async updateBrand(id, data) {
        const updatedBrand = await Brand.findByIdAndUpdate(id, data, {
            new: true,
        });
        return updatedBrand;
    }

    // Get a brand
    async getBrand(id) {
        const getBrand = await Brand.findById(id);
        return getBrand;
    }

    // Get a brand
    async getAllBrand() {
        const getAllBrand = await Brand.find();
        return getAllBrand;
    }

    // Delete a brand
    async deleteBrand(id) {
        const deletedBrand = await Brand.findByIdAndDelete(id);
        return deletedBrand;
    }
}

module.exports = new BrandService();
