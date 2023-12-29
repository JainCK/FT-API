require ('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const grid = require('gridfs-stream');
const methodOverride = require('method-override')


const User = require('./src/models/User');
const File = require('./src/models/File');
const Collaboration = require('./src/models/Collaboration');



const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(methodOverride('_method'));

mongoose.connect(process.env.MONGO_URI);

app.get('/', (req, res) => {
    res.send('FS & Collab API');
});

const authRoutes = require ('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
})

module.exports = app;