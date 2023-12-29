require ('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const grid = require('gridfs-stream');
const bodyParser = require('body-parser');
const cors = require('cors');


const User = require('./src/models/User');
const File = require('./src/models/File');
const Collaboration = require('./src/models/Collaboration');


const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)

app.get('/', (req, res) => {
    res.send('FS & Collab API');
});

const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
  gfs = grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
  console.log('GridFS connection established');
});


const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);


const fileRoutes = require('./src/routes/fileRoutes')(gfs);
app.use('/api/files', fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
})

module.exports = app;