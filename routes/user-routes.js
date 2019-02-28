const cheerio = require("cheerio")
const axios = require("axios")
const db = require("../models")
const mongoose = require("mongoose")
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema

module.exports = (app) => {
    // Scrape the articles
    app.get("/scrapeUserPage/:id", (req, res) => {

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
            res.redirect("/userPage/"+req.params.id)
        })
    })


    // Render the user page
    app.get("/userPage/:id", (req, res) => {
        db.Article.find()
        .sort('date')
        .populate('note')
        .then(function (dbArticleNote) {
            res.render("user", { userId:req.params.id, data: dbArticleNote })
        })
        .catch(err => res.send("ERROR"))
    })

    // post user notes 
    app.post("/addUserNote/:userId/:articleId", (req, res) => {
        console.log(req.params)
        console.log(req.body)
        db.Note.create(req.body)
            .then(dbNote => {
                return [db.Article.findOneAndUpdate({ _id: req.params.articleId }, { "$push": { note: dbNote._id } }, { new: true }),dbNote]
            })
            .spread((dbArticle, dbNote) => (db.User.findOneAndUpdate({ _id: req.params.userId},{ "$push": { note: dbNote._id }},{ new: true })))
            .then(dbNote => res.redirect('/userPage/'+req.params.userId))
            .catch(err => res.json(err))
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

    app.get("/deleteComment/:id/:userId", (req, res) => {
        // console.log(req.params.id)
        db.Note.findById(req.params.id)
            .then(dbNote => { 

                // adding model reference
                dbNote.Article = db.Article
                dbNote.User = db.User

                // console.log(dbNote)
                dbNote.remove(function(){
                    res.redirect("/userPage/"+req.params.userId)
                })
            })
    });
}