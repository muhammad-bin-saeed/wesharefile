const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

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

