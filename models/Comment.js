var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ComSchema = new Schema({
  title: String,
  body: String
});

var Comment = mongoose.model("Comment", ComSchema);

module.exports = Comment;
