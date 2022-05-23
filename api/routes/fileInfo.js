const router = require('express').Router();
const upload = require('../../config/multer');
const File = require('../models/file');
const sendMail = require('../../services/sendMail');

router.get('/:fileId', (req, res) => {
  File.findById(req.params.fileId).then(file => {
    if (!file) {
      res.render('error', { error: 'Your Link is Expired' });
    }
    res.render('fileInfo', { file });
  }).catch(error => {
    res.render('error', { error });
  });
});

router.post('/send', upload.none(), (req, res) => {
  const { fileId, emailFrom, emailTo } = req.body;
  if (!fileId || !emailFrom || !emailTo) {
    res.status(400).json({
      message: 'Missing required fields' 
  }); }
  
  File.findById(fileId).then(file => {
    if(file.sender) {
      res.status(400).json({message: 'File already sent'})
    } else {
      file.sender = emailFrom;
      file.receiver = emailTo;
      file.save().then(() => {
        sendMail(file);
        res.status(200).json({message: 'File sent'})
      }).catch(error => {
        res.status(500).json({error})
      })
    }

});


});

module.exports = router;