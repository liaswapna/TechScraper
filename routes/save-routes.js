const cheerio = require("cheerio")
const axios = require("axios")
const db = require("../models")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

module.exports = (app) => {
    app.get("/saved", (req, res) => {
        res.render("save")
    });
}
