const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const grid = require('gridfs-stream');
const multer = require('multer');


const File = require('../models/File');

let gfs;
mongoose.connection.once('open', () => {
  gfs = grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});


const storage = multer.memoryStorage();
const upload = multer({ storage });

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

