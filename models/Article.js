const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')
const Schema = mongoose.Schema

// Define schema for the Article model
const ArticleSchema = new Schema({
    title:{
        type: String,
        required: true,
        unique: true,
    },
    link:{
        type: String,
        required: true,
        unique: true,
    },
    image:{
        type: String,
        default: "https://via.placeholder.com/150"
    },
    author:{
        type: String,
        default:"anonymous"
    },
    profile:{
        type: String,
        default:"#"
    },
    date:{
        type: Date,
        default: Date.now
    },
    note:[{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
})

// Define the plugin
ArticleSchema.plugin(findOrCreate)

// Create Article model from Schema
const Article = mongoose.model("Article", ArticleSchema)

module.exports = Article