const Enquiry = require("../models/EnquiryModel");

class EnquiryService {
    // Create a Enquiry
    async createEnquiry(data) {
        const newEnquiry = await Enquiry.create(data);
        return newEnquiry;
    }

    // Update a Enquiry
    async updateEnquiry(id, data) {
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, data, {
            new: true,
        });
        return updatedEnquiry;
    }

    // Get a Enquiry
    async getEnquiry(id) {
        const getEnquiry = await Enquiry.findById(id);
        return getEnquiry;
    }

    // Get a Enquiry
    async getAllEnquiry() {
        const getAllEnquiry = await Enquiry.find();
        return getAllEnquiry;
    }

    // Delete a Enquiry
    async deleteEnquiry(id) {
        const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
        return deletedEnquiry;
    }
}

module.exports = new EnquiryService();
