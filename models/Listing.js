var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ListSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  readLater: {
    type: Boolean,
    default: false
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

var Listing = mongoose.model("Listing", ListSchema);

module.exports = Listing;