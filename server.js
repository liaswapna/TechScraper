const express = require("express")
const exphbs = require("express-handlebars")
const cheerio = require ("cheerio")
const mongoose = require("mongoose")
const axios = require("axios")
const app = express()
const PORT = process.env.PORT || 3000
const db = require("./models")
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";


//  middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//  static files
app.use(express.static("public"))

//  handlebars view engine
app.engine("handlebars",exphbs({defaultLayout:"main"}))
app.set("view engine","handlebars")

// connect to mongoose
mongoose.connect(MONGODB_URI,{useNewUrlParser: true})

require("./routes/api-routes")(app)

app.listen(PORT,()=>{
    console.log("App running on port:%s",PORT)
})




