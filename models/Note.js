const mongoose = require("mongoose")
const Schema = mongoose.Schema
const db = require("../models")

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

// Define middleware to handle cascade delete
NoteSchema.post('remove', async function(next) {
    
    await this.Article.findOneAndUpdate({ note: this._id }, { "$pull": { note: this._id } })
    await this.User.findOneAndUpdate({ note: this._id }, { "$pull": { note: this._id } })
    next();
});

// Create the Note model from Schema
const Note = mongoose.model("Note",NoteSchema)

module.exports = Note