const cheerio = require("cheerio")
const axios = require("axios")
const db = require("../models")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

module.exports = (app) => {

    // Scrape the articles
    app.get("/scrape", (req, res) => {

        axios.get("https://www.theverge.com/tech").then(function (response) {
            let $ = cheerio.load(response.data)

            $(".c-compact-river__entry").each(function (i, element) {
                const result = {}
                result.title = $(element)
                    .children("div")
                    .children("div")
                    .children("h2")
                    .children("a")
                    .text()

                result.link = $(element)
                    .children("div")
                    .children("a")
                    .attr("href")

                let imageURL = $(element)
                    .children("div")
                    .children("a")
                    .children("div")
                    .children("noscript")
                    .text()

                if (imageURL) {
                    result.image = imageURL.split(" ")[2].split('"')[1]
                }

                result.author = $(element)
                    .children("div")
                    .children("div")
                    .children("div")
                    .find("span")
                    .first()
                    .children("a")
                    .text()

                result.profile = $(element)
                    .children("div")
                    .children("div")
                    .children("div")
                    .find("span")
                    .first()
                    .children("a")
                    .attr("href")

                // Insert datas into Article model
                db.Article.findOrCreate(result)
                    .then(dbArticle => { })
                    .catch(err => console.log(err))
            })
            res.redirect("/")
        })
    })

    // Render home page route
    // Datas: articles & notes
    app.get("/", (req, res) => {
        db.Article.find()
            .sort('date')
            .populate('note')
            .then(function (dbArticleNote) {
                res.render("home", { data: dbArticleNote })
            })
            .catch(err => res.send("ERROR"))
    })

    // Save the user details to user collection
    app.post("/user", (req, res) => {
        console.log(req.body)
        db.User.findOrCreate(req.body)
            .then(dbUser => {
                res.json({id:dbUser.doc._id,userName:dbUser.doc.userName})
            })
            .catch(err => console.log(err))
    })

    // push the comments into note model and update article model
    app.post("/articlesNote/:id", (req, res) => {
        db.Note.create(req.body)
            .then(dbNote => db.Article.findOneAndUpdate({ _id: req.params.id }, { "$push": { note: dbNote._id } }, { new: true }))
            .then(dbArticle => res.json(dbArticle))
            .catch(err => res.json(err))
    })

}