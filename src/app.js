const express = require("express");
const path = require("path");


const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const upload = multer({ storage: multer.memoryStorage() });
const s3 = new S3Client({ region: 'ap-south-1' }); // change if needed

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});


app.get("/users", (req, res) => {
  res.json([{ id: 1, name: "Aakash" }]);
});

app.get("/books",(req,res) => {
    res.json([{ id: 1, name: "Book New" }]);
});

app.get("/prices",(req,res) => {
  res.json([{ id: 1, name: "price" }]);
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    const params = {
      Bucket: 'software-s3-bucket',
      Key: Date.now() + '-' + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    await s3.send(new PutObjectCommand(params));

    const fileUrl = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;

    res.json({
      message: 'Upload successful',
      url: fileUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Upload failed');
  }
});



module.exports = app;