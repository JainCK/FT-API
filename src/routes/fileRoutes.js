const express = require('express');
const router = express.Router();
const multer = require('multer');
const grid = require('gridfs-stream');
const { routes } = require('../../app');

let gfs;

// Initialize GridFS with the provided connection
const initializeGfs = (conn) => {
  gfs = grid(conn.db, require('mongoose').mongo);
  gfs.collection('uploads');
  console.log('GridFS connection established');
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

// File Upload Route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('File Upload Request Received');

      if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const buffer = req.file.buffer;
      const filename = req.file.originalname;

      console.log('Creating write stream');
      const writestream = gfs.createWriteStream({
        filename: filename,
      });

      writestream.on('error', (error) => {
        console.error('Write stream error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });

      writestream.on('finish', async () => {
        console.log('Write stream finished');

        const newFile = new File({
          filename: filename,
          size: buffer.length,
          type: req.file.mimetype,
        });

        await newFile.save();

        console.log('File saved to database');

        res.status(201).json({
          message: 'File uploaded successfully',
        });
      });

      writestream.write(buffer);
      writestream.end();
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  module.exports = { initializeGfs, fileRoutes: router }; 