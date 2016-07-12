/**
 * Created by Tabish Rizvi
 */

"use strict";
var express = require("express"),
    bodyParser = require("body-parser"),
    morgan = require("morgan");

var routes = require("./routes");

var app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use("/api/v1", routes);

app.get("/favicon.ico", function (req, res) {
    res.set("Content-Type", "image/x-icon");
    res.status(200).end();
});

app.use(function (req, res, next) {
    var err = new Error(req.originalUrl + " not Found");
    err.status = 404;
    next(err);
});

app.use(function (err, req, res) {
    if (err.status === 400) {
        res.status(400).send("Invalid JSON");
        return;
    }
    res.status(500).send("Internal Server Error");

});

module.exports = app;