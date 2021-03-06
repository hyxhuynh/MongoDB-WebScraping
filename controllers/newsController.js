// Require dependencies
var express = require("express");
var router = express.Router();

// var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require Models
var db = require("../models")

// A GET route for scraping the website
router.get("/scrape", function(req, res) {
    axios.get("https://www.geekwire.com/").then(function(response) {

        // Load the Response into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);
      
        // Remove all documents, which are NOT SAVED, from NewsArticle collection, then add new ones
        db.NewsArticle.deleteMany({ saved: false }, function(err,removed) {
            console.log(err);
            console.log(removed);
        });

        // With cheerio, find each p-tag with the "title" class
        // (i: iterator. element: the current element)
        $("article").each(function(i, element) {
            // console.log("Element: ", element)

            var titleElement = $(element).find("h2.entry-title");
            var summaryElement = $(element).find("div.entry-summary");

            // Save an empty result object
            var result = {};
            
            // Add the text and href of every link, and save them as properties of the result object
            result.title = titleElement
                .children("a")
                .text();
            result.link = titleElement
                .children("a")
                .attr("href");
            result.summary = summaryElement
                .children("p")
                .text();
            result.summary = result.summary.replace("… Read More", "…");

            
            // Check if artile title or link is missing
            if(result.title !== "" && result.link !== ""){
                var titlesArray = [];
                // Check if there is duplicate articles
                if (titlesArray.indexOf(result.title) === -1) {
                    titlesArray.push(result.title);
                    console.log('TITLES ARRAY', titlesArray)
                    // Create a new NewsArticle using the `result` object built from scraping
                    db.NewsArticle.create(result)
                        .then(function(dbNewsArticle) {
                            // View the added result in the console
                            console.log(dbNewsArticle);
                        })
                        .catch(function(err) {
                            // If an error occurred, log it
                            console.log(err);
                        });
                } else {
                    console.log("Duplicate Articles");
                }
            } else {
                console.log("Title or Link is missing!");
            }
    
        });
        // Send a message to the client
        // res.send("Scrape Complete");

        // Redirect to HomePage
        res.redirect('/');
    });
});

// Route for getting all NewsArticles from the db
router.get("/api/NewsArticles", function(req, res) {
    // Grab every document in the NewsArticles collection
    db.NewsArticle.find({})
      .then(function(dbNewsArticle) {
        // If we were able to successfully find NewsArticles, send them back to the client
        res.json(dbNewsArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

// Route for grabbing a specific NewsArticle by ID, populate it with its note
router.get("/api/NewsArticles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in the db...
    db.NewsArticle.findOne({_id: req.params.id})
        //... and populate all of the notes associated with it
        .populate("notes")
        .then(function(dbNewsArticle) {
            // If we were able to successfully find a NewsArticle with the given id, send it back to the client
            res.json(dbNewsArticle);
        });
});

router.post("/api/NewsArticles/save/:id", function(req, res) {
    db.NewsArticle.findOneAndUpdate({_id: req.params.id }, { $set: { saved: req.body.save } }, { new: true }).then(function(data) {
        // If we were able to successfully update an NewsArticle, send it back to the client
        res.json(data);
    }).catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
})

// Route for saving/updating a NewsArticle's associated Note
router.post("/api/NewsArticles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one NewsArticle with an `_id` equal to `req.params.id`. Update the NewsArticle to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated NewsArticle -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.NewsArticle.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id }}, { new: true });
      })
      .then(function(dbNewsArticle) {
        // If we were able to successfully update an NewsArticle, send it back to the client
        res.json(dbNewsArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

router.post("/api/Notes/delete/:id", function(req, res){
    db.Note.deleteOne({_id: req.params.id }).then( function(deleted){
      res.json(deleted);
    })
    .catch(function(err) {
      res.json(err);
    });
});

module.exports = router;

