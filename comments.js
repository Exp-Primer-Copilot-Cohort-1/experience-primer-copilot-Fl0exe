// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var ROOT_DIR = "html/";
var counter = 0;
var comments = [];

http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true, false);
    console.log("URL path "+urlObj.pathname);
    console.log("URL search "+urlObj.search);
    console.log("URL query "+urlObj.query["q"]);

    if (urlObj.pathname.indexOf("comment") !=-1) {
        if (req.method === "POST") {
            console.log("POST comment route");
            var jsonData = "";
            req.on('data', function (chunk) {
                jsonData += chunk;
            });
            req.on('end', function () {
                var reqObj = JSON.parse(jsonData);
                console.log(reqObj);
                console.log("Name: "+reqObj.Name);
                console.log("Comment: "+reqObj.Comment);
                comments.push(reqObj);
                res.writeHead(200);
                res.end("");
            });
        } else if (req.method === "GET") {
            console.log("In GET");
            var jsonData = JSON.stringify(comments);
            res.writeHead(200);
            res.end(jsonData);
        }
    } else {
        fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    }
}).listen(80);

console.log('Server running on port 80.');