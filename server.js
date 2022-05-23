const express = require('express');
const dbConnect = require('./config/mongodb');
const UploadRouter = require('./api/routes/fileUpload');
const InfoRouter = require('./api/routes/fileInfo');

const app = express();
app.use("/static", express.static("static"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

dbConnect();

app.get('/', (req, res)=>{
  res.render('index')
})
app.use('/api/upload', UploadRouter)
app.use('/files', InfoRouter)


app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error
    }
  });
});

app.listen(PORT, () => {})