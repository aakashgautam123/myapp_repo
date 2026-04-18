const express = require("express");
const path = require("path");


const multer = require('multer');
const { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const  { getSignedUrl } =  require("@aws-sdk/s3-request-presigner");


const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const upload = multer({ storage: multer.memoryStorage() });
const s3 = new S3Client({ region: 'ap-south-1' }); // change if needed

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
app.get('/images', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'images.html'));
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

    const fileUrl = `https://dedbl11jcbpwn.cloudfront.net/${params.Key}`;

    res.json({
      message: 'Upload successful',
      url: fileUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Upload failed');
  }
});

app.get("/api/images", async (req, res) => {
  try {
    const data = await s3.send(
      new ListObjectsV2Command({
        Bucket: "software-s3-bucket",
      })
    );

    const images = await Promise.all(
      (data.Contents || []).map(async (item) => {
        const command = new GetObjectCommand({
          Bucket: "software-s3-bucket",
          Key: item.Key,
        });

        // const url = await getSignedUrl(s3, command, {
        //   expiresIn: 3600,
        // });
        const url = `https://dedbl11jcbpwn.cloudfront.net/${item.Key}`

        return {
          key: item.Key,
          url,
        };
      })
    );

    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});


module.exports = app;