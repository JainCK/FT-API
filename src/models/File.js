const mongoose = require('mongoose');
const {Schema} = mongoose;

const fileSchema = new Schema({
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;