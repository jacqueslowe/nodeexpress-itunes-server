const express = require('express');
const app = express();
const path = require('path');
const request = require('request');
const https = require("https");
var url = require('url');
var hostName = 'localhost'; 
var port = 8080;           

//Error 304 - fix
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
    res.sendFile(path.join(__dirname + '/index.htm'))
})

// http.GET /music provide music request to user
// http.request syntax example - http://localhost:8080/music?artist=boston&provider=apple
app.get('/music', function (req, res) {
    //"https://itunes.apple.com/search?term=Air&limit=25&entity=song"
    const itunesUrl = 'https://itunes.apple.com/search?';
    const limit = "&limit=25";
    const type = "&entity=song";
    const song = (req.query.song) ? req.query.song: "love";
    const urlExtras = 'term='+song + limit + type;
    console.log('GET music: song:'+song);
    console.log('GET music: url:'+itunesUrl+urlExtras);

   request(itunesUrl+urlExtras, { json: true }, (err, response, body) => {
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
            let items:any[] = [];
            for (var i = 0, len = body.results.length; i < len; i++) {
                someFn(arr[i]);
              }
            res.write(JSON.stringify(body));    //find a better way to build this.
            res.end();
            console.log("Success: resultCount:" + body.resultCount);
            return;
        });
})

app.listen(port, hostName, function () {
    console.log('Listening on port ' + port);
})