//Variable set up.
var express = require("express");
var app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require('express-session');
var FileStore = require('session-file-store')(session);

//Set global variable root path that points to the base folder for this application.
global.appRoot = path.resolve(__dirname);

//Grab the routes module.
var routes = require(__dirname + "/server/routes/routes.js");

//Set view engine
app.set('view engine', 'jade');
app.set('views', __dirname + '/client/');
app.set('view options', {
    layout: false
});

app.use(session({
  name: 'server-session-cookie-id',
  secret: 'my express secret',
  cookie: { maxAge: 120000 },
  saveUninitialized: false,
  resave: false,
  store: new FileStore({reapAsync:true, reapInterval:300})
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//Mount static files to root.
app.use(express.static(__dirname + '/client'));

//Route traffic.
routes(app);

//Wait for connections.
app.listen(process.env.PORT || 8080, function(){
    console.log('Server is listening on port: ' + process.env.PORT || 8080);
});

