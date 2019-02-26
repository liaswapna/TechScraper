const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Define Schema for the Note model
const NoteSchema = new Schema({
    User: {
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

// Create the Note model from Schema
const Note = mongoose.model("Note",NoteSchema)

module.exports = Note