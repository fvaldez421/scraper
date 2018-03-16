var path = require("path");
var db = require("../models");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

module.exports = function(app) {

app.get("/scrape", function(req, res) {

  request("http://www.echojs.com/", function(error, response, html) {
    var $ = cheerio.load(html);

    $("article h2").each(function(i, element) {
      var searchResult = {};

      searchResult.title = $(this)
        .children("a")
        .text();
      searchResult.link = $(this)
        .children("a")
        .attr("href");
      
      db.Result.create(searchResult)
        .then(function(dbResults) {
          console.log(dbResults);
        })
        .catch(function(err) {
          // res.json(err);
        });
    });

    res.send("Scrape Complete");
  });
});

app.get("/results", function(req, res) {
  db.Result.find({})
    .then(function(dbResults) {
      console.log(dbResults);
      res.json(dbResults);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/results/:id", function(req, res) {
  db.Result.findOne({ 
    _id: req.params.id
  })
    .populate("comment")
    .then(function(dbResults) {
      res.json(dbResults);
    })
      .catch(function(err) {
        res.json(err);
      });
});

app.post("/results/:id", function(req, res) {
db.Comment.create(req.body)
  .then(function(dbComment) {
    return db.Result.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment.id }, { new: true });
  })
    .then(function(dbUser) {
      res.json(dbUser);
    })
      .catch(function(err) {
        res.json(err);
      });
});

}