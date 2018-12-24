
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NewsArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  notes: [
    {
      type: Schema.Types.ObjectId,
      // the ref property refer to the Note model
      // name needs to be exact as the model file
      // "Note" vs. Note.js
      ref: "Note"
    }
  ]
});

var NewsArticle = mongoose.model("NewsArticle", NewsArticleSchema);

//export model
module.exports = NewsArticle;