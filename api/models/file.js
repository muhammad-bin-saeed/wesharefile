const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  fileId : {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  sender: String,
  receiver: String,
  expireAt: {
    type: Date,
    default: Date.now,
    expires: 1800
  }
},
);

fileSchema.index({ expireAt: 1 }, { expireAfterSeconds: 1800 });

module.exports = mongoose.model('File', fileSchema);