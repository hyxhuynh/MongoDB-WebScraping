
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
  comment: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

var NewsArticle = mongoose.model("NewsArticle", NewsArticleSchema);

//export model
module.exports = NewsArticle;