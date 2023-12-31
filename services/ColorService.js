const Color = require("../models/ColorModel");

class ColorService {
    // Create a Color
    async createColor(data) {
        const newColor = await Color.create(data);
        return newColor;
    }

    // Update a Color
    async updateColor(id, data) {
        const updatedColor = await Color.findByIdAndUpdate(id, data, {
            new: true,
        });
        return updatedColor;
    }

    // Get a Color
    async getColor(id) {
        const getColor = await Color.findById(id);
        return getColor;
    }

    // Get a Color
    async getAllColor() {
        const getAllColor = await Color.find();
        return getAllColor;
    }

    // Delete a Color
    async deleteColor(id) {
        const deletedColor = await Color.findByIdAndDelete(id);
        return deletedColor;
    }
}

module.exports = new ColorService();
