const router = require('express').Router();
const upload = require('../../config/multer');
const mongoose = require('mongoose');
const cloudinary = require('../../config/cloudinary');
const File = require('../models/file');

router.post('/', upload.single("fileUpload") ,(req, res) => {
  const { file } = req;
  cloudinary.uploader.upload(file.path, (err, imgRes) => {
    if(err) {
      res.render('error', {
        error: err.message
      });
    } else {
      const url = imgRes.url.split("/")[imgRes.url.split("/").length-2];
      const newUrl = imgRes.url.replace(url, "fl_attachment");
      const file = new File({
        _id: new mongoose.Types.ObjectId(),
        fileId : imgRes.public_id,
        fileName: imgRes.public_id+"."+imgRes.format,
        fileSize: imgRes.bytes < (1024*1024) ? (imgRes.bytes / 1024).toFixed(2) + " KB" : (imgRes.bytes / (1024*1024)).toFixed(2) + " MB",
        filePath: newUrl,
      });
      file.save().then(file => {
        res.status(201).json({  
          message: 'File added successfully',
          url: `${process.env.APP_URI || "localhost:3000"}/files/${file._id}`,
        });
      }).catch(error => {
        res.status(500).json({
          message: 'Creating a file failed!',
          error: error
        });
      
    });
  }
  });
});

module.exports = router;