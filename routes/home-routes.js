const cheerio = require("cheerio")
const axios = require("axios")
const db = require("../models")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

module.exports = (app) => {

    // Scrape the articles
    app.get("/scrape", (req, res) => {
        // let datas = []
        axios.get("https://www.theverge.com/tech").then(function (response) {
            let $ = cheerio.load(response.data)

            // console.log(response.data)

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

                // datas.push(result)

                // Insert datas into Article model
                db.Article.findOrCreate(result)
                    .then(dbArticle => {
                        // console.log(dbArticle)
                    })
                    .catch(err => console.log(err))
            })
            // console.log(datas)
            // res.send("scrape complete")



            res.redirect("/")
        })
    })

    // Render home page route
    // Datas: articles & notes
    app.get("/", (req, res) => {
        db.Article.find({})
            .populate('note')
            .then(function (dbArticleNote) {
                // console.log(dbArticleNote[0])
                res.render("home", { data: dbArticleNote })
                // res.json(dbArticleNote)
            })
            .catch(err => res.send("ERROR"))
    })

    // push the comments into note model and update article model
    app.post("/articles/:id", (req, res) => {
        console.log(req.params.id)
        console.log(req.body)
        db.Note.create(req.body)
            // author.stories.push(story1);
            // .then(dbNote => db.Article.note.push({_id:req.params.id},{note: dbNote._id},{new:true}))
            .then(dbNote => db.Article.findOneAndUpdate({ _id: req.params.id }, { "$push": { note: dbNote._id } }, { new: true }))
            .then(dbArticle => res.json(dbArticle))
            .catch(err => res.json(err))
        // db.Article.findOne({_id:req.params.id})
        //     .then(dbArticle => res.json(dbArticle))
        //     .catch(err => res.json(err))
    })

    // route to delete the comment
    app.get("/deleteComment/:id", (req, res) => {
        console.log(req.params.id)
        db.Note.deleteOne({ _id: req.params.id })
            .then(dbNote => (db.Article.findOneAndUpdate({ note: req.params.id }, { "$pull": { note: req.params.id } })))
            .then(dbArticle => {
                // console.log(dbArticle)
                res.redirect("/")
            })
            .catch(err => res.json(err))


    });

}