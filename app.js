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

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("connected to MongoDB database successfully");
})
.catch(() => {
    console.log("error occurred while connecting to MongoDB database in the example file");
});

app.get('/', (req, res) => {
    res.send('FS & Collab API');
});

let gfs;
mongoose.connection.on('open', () => {
    console.log("connection established successfully")
    gfs = grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
})


const authRoutes = require('./src/routes/authRoutes');
const fileRoutes = require('./src/routes/fileRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
})

module.exports = app;