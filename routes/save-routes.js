const cheerio = require("cheerio")
const axios = require("axios")
const db = require("../models")
const mongoose = require("mongoose")
// mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema

module.exports = (app) => {

    //  Render save page with nested collection
    app.get("/savedPage/:id", (req, res) => {
        db.User.find({ _id: req.params.id })
            .populate({
                path:'saved',
                populate:{
                    path: 'note',
                    model: 'Note'
                }
            })
            .then(function (dbUserArticle) {
                console.log(dbUserArticle[0])
                res.render("save", { userId: req.params.id, data: dbUserArticle[0].saved })
            })
            .catch(err => res.send("ERROR"))
    });

    // Delete saved article
    app.get("/updateUnSave/:userId/:articleId", (req, res) => { 
        db.User.findOneAndUpdate({ _id: req.params.userId }, { "$pull": { saved: req.params.articleId } })
            .then(dbUser => {
                console.log("back from db" + dbUser)
                res.redirect("/savedPage/"+req.params.userId)
            })
            .catch(err => res.json(err))
    });

    // dele
    app.get("/deleteCommentSavePage/:id/:userId", (req, res) => {
        // console.log(req.params.id)
        db.Note.findById(req.params.id)
            .then(dbNote => { 

                // adding model reference
                dbNote.Article = db.Article
                dbNote.User = db.User

                // console.log(dbNote)
                dbNote.remove(function(){
                    res.redirect("/savedPage/"+req.params.userId)
                })
            })
    });

    // post user notes and redirect to savePage
    app.post("/addUserNoteSavePage/:userId/:articleId", (req, res) => {
        console.log(req.params)
        console.log(req.body)
        db.Note.create(req.body)
            .then(dbNote => {
                return [db.Article.findOneAndUpdate({ _id: req.params.articleId }, { "$push": { note: dbNote._id } }, { new: true }),dbNote]
            })
            .spread((dbArticle, dbNote) => (db.User.findOneAndUpdate({ _id: req.params.userId},{ "$push": { note: dbNote._id }},{ new: true })))
            .then(dbNote => res.redirect('/savedPage/'+req.params.userId))
            .catch(err => res.json(err))
    })

}
