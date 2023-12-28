require ('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const User = require('./src/models/User');
const File = require('./src/models/File');
const Collaboration = require('./src/models/Collaboration');



const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.get('/', (req, res) => {
    res.send('FS & Collab API');
});

const authRoutes = require ('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
})