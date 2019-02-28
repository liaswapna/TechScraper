const cheerio = require("cheerio")
const axios = require("axios")
const db = require("../models")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

module.exports = (app) => {

    // Render the user page
    app.get("/userPage/:id", (req, res) => {
        db.Article.find({ saved: false })
        .sort('date')
        .populate('note')
        .then(function (dbArticleNote) {
            res.render("user", { userId:req.params.id, data: dbArticleNote })
        })
        .catch(err => res.send("ERROR"))
    })

    // Update the article saved
    app.put("/updateSave", (req, res) => {
        console.log(req.body)
        db.User.updateOne({ _id: req.body.userId} , {$addToSet: { saved: req.body.articleId } })
            .then(dbUser => {
                console.log("back from db"+dbUser)
                res.redirect("/userPage")
            })
            .catch(err => res.json(err))
            
    });
}