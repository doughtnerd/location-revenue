var express = require("express");
var app = express();
var path = require("path");

global.appRoot = path.resolve(__dirname);

var routes = require(__dirname + "/server/routes/routes.js");

app.use(express.static(__dirname + '/client/'));

routes(app);

app.listen(process.env.PORT || 8080, function(){
    //console.log(process.env.NODE_PATH);
    //console.log(require("fs").existsSync("./jar/runner.jar")?"its there":"its not there");
});

