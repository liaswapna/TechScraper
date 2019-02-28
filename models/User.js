const mongoose = require("mongoose")
const findOrCreate = require('mongoose-findorcreate')
const Schema = mongoose.Schema

// Define Schema for User model
const UserSchema = new Schema({
    userName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    saved:[{
        type: Schema.Types.ObjectId,
        ref: "Article"
    }],
    note:[{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
})

// Define the plugin
UserSchema.plugin(findOrCreate)

// Create Article model from Schema
const User = mongoose.model("User", UserSchema)

module.exports = User