// src/routes/fileRoutes.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');

const File = require('../models/File');

// Initialize GridFS
let gfs;
mongoose.connection.once('open', () => {
  gfs = grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload a file
router.post('/upload', async (req, res) => {
  res.json({message: 'hello' })
});



module.exports = router;
