const cheerio = require("cheerio")
const axios = require("axios")
const db = require("../models")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

module.exports = (app) => {
    app.get("/saved", (req, res) => {
        db.Article.find({saved: true})
            .populate('note')
            .then(function (dbArticleNote) {
                // console.log(dbArticleNote[0])
                res.render("save", { data: dbArticleNote })
                // res.json(dbArticleNote)
            })
            .catch(err => res.send("ERROR"))
        // res.render("save")
    });
}
