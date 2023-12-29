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

const conn = mongoose.connection;

const { initializeGfs, fileRoutes } = require('./src/routes/fileRoutes');

conn.once('open', () => {
  initializeGfs(conn);
});

mongoose.connect(process.env.MONGO_URI);

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const { fileRoutes: apiFileRoutes } = require('./src/routes/fileRoutes');
app.use('/api/files', apiFileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

module.exports = app;
