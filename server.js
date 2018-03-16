var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var path = require("path");
var request = require("request");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/googleSearch", {
  useMongoClient: true
});

mongoose.connection.on("connected", function() {
	console.log("Mongoose connected");
})

require("./routes/htmlRoutes.js")(app);

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});