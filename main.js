var http = require('http');
var fs = require('fs');
var file = './data/data.json';

// args = node server.js file filename.json
var server = http.createServer(function(req, res) {
   
    //assume 3rd parameter is a file path
    if( process.argv.length > 3 && process.argv[2] =='file')
    {
        file = process.argv[3];
    }
    console.log('serving file - ' + file );

    if (fs.existsSync(file)) {
        //Read file
       /* fs.readFile(file, 'utf8', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });*/
        var data = '';

        var readerStream = fs.createReadStream(file)

        readerStream.setEncoding('UTF8')

        readerStream.on('data', (chunk) => {
        data += chunk;
        });

        readerStream.on('end',() => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
            console.log(data);
        });

        readerStream.on('error', (err) => {
        console.log(err.stack);
        });
    }
    else
    {
        res.writeHead(500, {'Content-Type': 'text/html'});
        res.write("File "  + file + " does not exist!");
        res.end();  
    }

}).listen(8080, 'localhost');//.listen(8080);

