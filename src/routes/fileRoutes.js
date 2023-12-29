const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const grid = require('gridfs-stream');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const File = require('../models/File');

const storage = multer.memoryStorage();
const upload = multer({ storage });

let gfs;

mongoose.connection.once('open', () => {
  gfs = grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});



const fileRoutes = (gfs) => {
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const buffer = req.file.buffer;
    

    res.status(201).json({
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
return router;
};

module.exports = fileRoutes;