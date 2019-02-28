const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Define Schema for the Note model
const NoteSchema = new Schema({
    user: {
        type: String,
        default: "Guest"
    },
    note: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

NoteSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    Article.remove({client_id: this._id}).exec();
    user.remove({client_id: this._id}).exec();
    next();
});

// Create the Note model from Schema
const Note = mongoose.model("Note",NoteSchema)

module.exports = Note