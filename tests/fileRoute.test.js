// routes/fileRoutes.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const grid = require('gridfs-stream');
const multer = require('multer');

const File = require('../models/File');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// File Upload Route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const buffer = req.file.buffer;
    const filename = req.file.originalname;

    const writestream = gfs.createWriteStream({
      filename: filename,
    });

    writestream.write(buffer);
    writestream.end();

    const newFile = new File({
      filename: filename,
      size: buffer.length,
      type: req.file.mimetype,
    });

    await newFile.save();

    res.status(201).json({
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
