const mongoose = require("mongoose");

mongoose.connect("mongodb://foodbridge-mongodb:27017/foodbridge", {
    serverSelectionTimeoutMS: 10000
})
.then(() => {
    console.log("Mongoose connected successfully inside Docker");
    process.exit(0);
})
.catch((error) => {
    console.error("Mongoose connection failed:", error.message);
    process.exit(1);
});
