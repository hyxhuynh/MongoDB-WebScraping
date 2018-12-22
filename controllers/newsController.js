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
var NewsArticle = require("../models/NewsArticle.js");
var Comment = require("../models/Comment")

// A GET route for scraping the website
router.get("/scrape", function(req, res) {
    axios.get("https://www.geekwire.com/").then(function(response) {

        // Load the Response into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);
      
        // With cheerio, find each p-tag with the "title" class
        // (i: iterator. element: the current element)
        $("h2.entry-title").each(function(i, element) {
            // console.log("Element: ", element)

            // Save an empty result object
            var result = {};
            
            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(element)
                .children("a")
                .text();
            result.link = $(element)
                .children("a")
                .attr("href");
            
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
        });
        // Send a message to the client
        res.send("Scrape Complete");
    });
});

module.exports = router;

