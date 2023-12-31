const mongoose = require("mongoose");
const ApiError = require("./api-error");
const validMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        throw new ApiError(400, "This id is not valid or not found!");
    }
};

module.exports = validMongoDbId;
