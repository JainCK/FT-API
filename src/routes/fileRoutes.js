const { Readable } = require('stream');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const { ObjectId } = require('mongodb');

const File = require('../models/File');

const initializeGfs = (db) => {
  return new GridFSBucket(db, {
    bucketName: 'uploads', 
  });
};


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fileRoutes = (bucket) => {
  const router = require('express').Router();

  router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { originalname, buffer } = req.file;
      const filename = originalname;

      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      const uploadStream = bucket.openUploadStream(filename);
      readableStream.pipe(uploadStream);

      uploadStream.on('finish', async () => {
        console.log('File uploaded successfully');

        const newFile = {
          filename: filename,
          size: buffer.length,
          type: req.file.mimetype,
        };

        
        const savedFile = await File.create(newFile);

        console.log('File saved to database');
        res.status(201).json({
          message: 'File uploaded successfully',
          fileId: savedFile._id,
        });
      });

      readableStream.on('error', (error) => {
        console.error('Read stream error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.put('/:fileId', async (req, res) => {
  try {
    const { filename } = req.body;
    await File.findOneAndUpdate({ _id: req.params.fileId }, { filename });
    res.status(200).json({ message: 'File metadata updated successfully' });
  }catch (error) {
    console.error('Update file error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const objectId = new ObjectId(fileId);

    // Directly delete from File collection
    const deletedFile = await File.findOneAndDelete({ _id: objectId });

    if (!deletedFile) {
      return res.status(200).json({ message: 'File not found. Considered deleted.' });
    }

    res.status(200).json({ message: 'File deleted successfully' });
    console.log("file deleted")
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/:fileId/content', async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const objectId = new ObjectId(fileId);

    // Check if the file exists in the File collection
    const file = await File.findOne({ _id: objectId });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Open a download stream from the GridFSBucket
    const downloadStream = bucket.openDownloadStream(objectId);

    // Pipe the download stream to the response
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  return router;
};

module.exports = { initializeGfs, fileRoutes };
