const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/file-sharing";

const dbConnect = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = dbConnect;

