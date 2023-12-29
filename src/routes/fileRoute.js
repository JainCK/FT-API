const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const grid = require('gridfs-stream');
const multer = require('multer');


const File = require('../models/File');
const readstream = require('gridfs-stream/lib/readstream');

let gfs;
mongoose.connection.once('open', () => {
  gfs = grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});


const storage = multer.memoryStorage();
const upload = multer({ storage });


//upload

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { originalname, mimetype, buffer } = req.file;

        const file = new File({
            filename: originalname,
            size: buffer.length,
            type: mimetype,
            owner: req.user._id,
        })

        await file.save();

        const writestream = gfs.createWriteStream({
            filename : file._id.toString(),
        })

        writestream.write(buffer);
        writestream.end();

        res.status(201).json({
            message: 'file uploaded successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Error'
        });
    }
})

//retrival

router.get('/:fileId', async (req, res) => {
    try {
        const file = await File.findById(req.params.fileId);
        if(!file){
            return res.status(404).json({
                error: 'file not found'
            });
        }
        res.status(200).json(file);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Error'
        });
    }
});

//download

router.get('/:fileId/content', async (req, res) => {
    try {
        const File = await File.findById(req.params.fileId);
        if(!File){
            return res.status(404).json({
                error: 'File not found'
            });
        }

        const readstream = gfs.createReadStream({
            filename: File._id.toString(),
        });


        readstream.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Error'
        });
    }
});

//update filename


router.put('/:fileId', async (req, res) => {
    try {
      const file = await File.findById(req.params.fileId);
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      file.filename = req.body.filename;
  
      await file.save();
  
      res.status(200).json({ message: 'File metadata updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


//delete

router.delete('/:fileId', async (req, res) => {
    try {
      const file = await File.findById(req.params.fileId);
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      await File.findByIdAndDelete(req.params.fileId);
  
      gfs.remove({ filename: req.params.fileId.toString(), root: 'uploads' }, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'File deleted successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
