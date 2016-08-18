var express = require("express");
var app = express();
var path = require("path");

global.appRoot = path.resolve(__dirname);

var routes = require(__dirname + "/server/routes/routes.js");

//Set view engine
app.set('view engine', 'jade');
app.set('views', __dirname + '/client/');
app.set('view options', {
    layout: false
});

app.use(express.static(__dirname + '/client/'));

routes(app);

app.listen(process.env.PORT || 8080, function(){
    console.log('Server is listening on port: ' + process.env.PORT || 8080);
});

