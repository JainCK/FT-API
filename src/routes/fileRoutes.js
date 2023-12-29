const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

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