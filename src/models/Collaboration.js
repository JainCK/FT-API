const mongoose = require('mongoose');
const {Schema} = mongoose;

const collaborationSchema = new Schema ({
    sessionId : { type: String, required: true },
    activity: { type: String, required: true},
});

const Collaboration = mongoose.model('Collaboration', collaborationSchema);

module.exports =  Collaboration;