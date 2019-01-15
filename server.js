var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var https = require("https");
var url = require('url');
var hostName = 'localhost';
var port = 8080;
//to fix error 304
app.disable('etag');
// basic CORS settings so that Chrome, Edge work propperly.
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        console.log('OPTIONS');
        res.sendStatus(200);
    }
    else {
        next();
    }
});
// http.GET / -return a basic html file
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.htm'));
});
// http.GET /music provide music request to user
// http.request syntax example - http://localhost:8080/term?term=boston
app.get('/music', function (req, res) {
    var itunesUrl = 'https://itunes.apple.com/search?';
    var limit = "&limit=25";
    var term = (req.query.term) ? req.query.term : "depeche mode";
    var urlExtras = 'term=' + term + limit;
    var url = "https://itunes.apple.com/search?term=Air&limit=25&entity=song";
    console.log('GET music: url:' + itunesUrl + urlExtras);
    //"https://itunes.apple.com/search?term=Air&limit=25&entity=song"
    request(itunesUrl + urlExtras, { json: true }, function (err, response, body) {
        if (err) {
            console.log('GET music: error');
            res.writeHead(500);
            res.write("an error occurred: " + err);
            res.end();
            console.log(err);
            return;
        }
        console.log('GET music: success');
        res.writeHead(200);
        var items = [];
        for (var i = 0, len = body.results.length; i < len; i++) {
            var item = {
                artistName: body.results[i].artistName,
                trackName: body.results[i].trackName,
                artworkUrl30: body.results[i].artworkUrl30,
                previewUrl: body.results[i].previewUrl
            };
            items.push(item);
        }
        res.write(JSON.stringify(items)); //find a better way to build this.
        res.end();
        console.log("Success: resultCount:" + body.resultCount);
        return;
    });
});
app.listen(port, hostName, function () {
    console.log('Listening on port ' + port);
});
