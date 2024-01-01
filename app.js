
require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const User = require('./src/models/User');
const File = require('./src/models/File');
const Collaboration = require('./src/models/Collaboration');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('FS & Collab API');
});



const { initializeGfs, fileRoutes, initializeSocketIo } = require('./src/routes/fileRoutes');
const conn = mongoose.connection;
const bucket = initializeGfs(conn); // Assuming `conn` is your MongoDB connection

const io = initializeSocketIo(httpServer);
const apiFileRoutes = fileRoutes(bucket, io);
app.use('/api/files', apiFileRoutes);

mongoose.connect(process.env.MONGO_URI);

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

module.exports = app;
