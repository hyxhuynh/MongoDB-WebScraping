// Require Models
var db = require("../models")

module.exports = function(app) {

    app.get('/', function (req, res) {
        db.NewsArticle.find({})
            .then(function(dbNewsArticles) {
                res.render('index', {newsArticles: dbNewsArticles});
            })
            .catch(function(err) {
                res.render(err);
            });
    }); 

    app.get('/article/:id', function (req, res) {
        
        db.NewsArticle.findOne({_id: req.params.id})
            //... and populate all of the notes associated with it
            .populate("notes")
            .then(function(dbNewsArticle) {
                res.render('notes', {newsArticle: dbNewsArticle });
            })
            .catch(function(err) {
                res.render(err);
            });
    }); 

    app.get('/savedArticles', function(req, res) {

        db.NewsArticle.find( { saved: true })
            .then(function(dbNewsArticles) {
                res.render('savedArticles', {newsArticles: dbNewsArticles});
            })
            .catch(function(err) {
                res.render(err);
            });
    });

}