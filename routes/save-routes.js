const cheerio = require("cheerio")
const axios = require("axios")
const db = require("../models")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

module.exports = (app) => {

    //  Render save page
    app.get("/saved/:id", (req, res) => {
        db.User.find({ _id: req.params.id })
            .populate('saved')
            .then(function (dbUserArticle) {
                res.render("save", { userId: req.params.id, data: dbUserArticle[0].saved })
            })
            .catch(err => res.send("ERROR"))
    });

    app.get("/updateUnSave/:userId/:articleId", (req, res) => {
        console.log("id" + req.params.userId)
        // db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
        //     .then(dbArticle => {
        //         res.redirect("/saved")
        //     })
        //     .catch(err => res.json(err))
        db.User.findOneAndUpdate({ _id: req.params.userId }, { "$pull": { saved: req.params.articleId } })
            .then(dbUser => {
                console.log("back from db" + dbUser)
                res.redirect("/saved/"+req.params.userId)
            })
            .catch(err => res.json(err))
        // db.User.updateOne({ _id: req.body.userId} , {$addToSet: { saved: req.body.articleId } })
        // .then(dbUser => {
        //     console.log("back from db"+dbUser)
        //     res.redirect("/userPage")
        // })
        // .catch(err => res.json(err))
    });
}
