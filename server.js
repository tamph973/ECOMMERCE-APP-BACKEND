const app = require("./app");
const dotenv = require("dotenv").config();
const { default: mongoose } = require("mongoose");

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connect to the database successfully!");

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    } catch (error) {
        console.log("Cannot connect to the database!", error);
        process.exit();
    }
}

startServer();
