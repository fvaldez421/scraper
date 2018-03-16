var path = require("path");
var db = require("../models");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function(app) {


app.get("/scrape", function(req, res) {
  db.Listing.remove({ readLater: false}, function(err) {});

  request("https://www.sfchronicle.com/", function(error, response, html) {
  
  var $ = cheerio.load(html);

    $("div.prem-hl-item").each(function(i, element) {
      var result = {};

      result.title = $(element).children("h2").text();

      result.link = "https://www.sfchronicle.com" + $(element).children("h2").children("a").attr("href");
     
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

app.post("/readLater", function(req, res) {
  console.log(req.body);
  db.Listing.findOneAndUpdate({ _id: req.body.id }, { readLater: req.body.state }, { new: true })
  .then(function(dbListings) {
    console.log(dbListings);
  });
})

app.get("/", function(req, res) {
  db.Listing.find({})
    .then(function(dbListings) {
      console.log(dbListings);
      res.render("index", { listing: dbListings});
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
      console.log(dbListings);
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
    return db.Listing.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment.id }, { new: true });
  })
    .then(function(dbUser) {
      console.log(dbUser);
      res.json(dbUser);
    })
      .catch(function(err) {
        console.log(err);
        res.json(err);
      });
});

}