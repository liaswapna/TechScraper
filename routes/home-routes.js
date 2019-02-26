const cheerio = require("cheerio")
const axios = require("axios")
const db = require("../models")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

module.exports = (app) => {

    // Scrape the articles
    app.get("/scrape", (req, res) => {
        let datas = []
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

                datas.push(result)

                // Insert datas into Article model
                db.Article.findOrCreate(result)
                    .then(dbArticle => {
                        // console.log(dbArticle)
                    })
                    .catch(err => console.log(err))
            })
            // console.log(datas)
            res.send("scrape complete")



            // res.render("test", { data: datas })
            // res.redirect("/")
        })
    })

}