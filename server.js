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

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/googleSearch", {
  useMongoClient: true
});

mongoose.connection.on("connected", function() {
	console.log("Mongoose connected");
})

app.get("/scrape", function(req, res) {

  request("http://www.echojs.com/", function(error, response, html) {
    var $ = cheerio.load(html);

    $("article h2").each(function(i, element) {
      var result = {};

      result.title = $(this).children("a").text();

      result.link = $(this).children("a").attr("href");
      
      db.Listing.create(result)
        .then(function(dbListings) {
          console.log(dbListings);
        })
        .catch(function(err) {
          return res.send(err);
        });
    });

    res.send("Scrape Complete");
  });
});

app.get("/results", function(req, res) {
  db.Listing.find({})
    .then(function(dbListings) {
      console.log(dbListings);
      res.json(dbListings);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/results/:id", function(req, res) {
  db.Listing.findOne({ 
    _id: req.params.id
  })
    .populate("comment")
    .then(function(dbListings) {
      res.json(dbListings);
    })
      .catch(function(err) {
        res.json(err);
      });
});

app.post("/results/:id", function(req, res) {
db.Comment.create(req.body)
  .then(function(dbComment) {
  	console.log(req.body);
    return db.Result.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment.id }, { new: true });
  })
    .then(function(dbUser) {
      res.json(dbUser);
    })
      .catch(function(err) {
        res.json(err);
      });
});
// require("./routes/htmlRoutes.js")(app);

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});