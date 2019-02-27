const cheerio = require("cheerio")
const axios = require("axios")
const db = require("../models")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

module.exports = (app) => {
    app.get("/saved", (req, res) => {
        db.Article.find({ saved: true })
            .populate('note')
            .then(function (dbArticleNote) {
                res.render("save", { data: dbArticleNote })
            })
            .catch(err => res.send("ERROR"))
    });

    app.get("/updateUnSave/:id", (req, res) => {
        db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
            .then(dbArticle => {
                res.redirect("/saved")
            })
            .catch(err => res.json(err))
    });
}
