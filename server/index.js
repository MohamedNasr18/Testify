const express = require('express');
const app = express();
const studentRouter = require('./routes/students.routes'); 
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

// Set up multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where files will be uploaded
    }, 
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
    }
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Upload route
app.post('/api/uploads', upload.single('image'), (req, res) => {
  if (req.file) {
      res.json({ message: 'File uploaded successfully', file: req.file });
  } else {
      res.status(400).json({ message: 'No file uploaded' });
  }
});



// Connect to MongoDB
const url = process.env.mongoUrl;
mongoose.connect(url)
    .then(() => console.log("mongodb connected successfully"))
    .catch(error => console.log("error is ", error));

// Middleware
app.use(express.json());
app.use(cors());

// Use the routers
app.use('/api/students', studentRouter);

// Start the server
app.listen(process.env.port, () => {
    console.log("server is running successfully...");
});
     