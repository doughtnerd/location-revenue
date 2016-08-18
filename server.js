var express = require("express");
var multer = require("multer");
var exec = require("child_process").exec;
var crypto = require("crypto");
var fs = require("fs");
var app = express();
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
        if(err){
            console.log('Error creating file hash');
            cb(null, createRandomHash() + '.' + require('mime').extension(file.mimetype));
        } else {
            cb(null, raw.toString('hex') + Date.now() + '.' + require('mime').extension(file.mimetype));
        }
    });
  }
});
var upload = multer({ storage: storage });

app.use(express.static(__dirname + '/app'));

app.get('/', function(req, res){
    res.sendFile(__dirname + "/app/index.html");
});

app.get('/download', function(req, res){
    res.download('./jar/Location Revenue Per Pound.jar', 'Location Revenue Per Pound.jar', function(err){
        if(err){
            console.log(err);
        } else {
            console.log('hooray');
        }
    });
});

app.post('/run', upload.array('reqFiles', 2) , function(req, res){
    var rev = req.files[0];
    var nat = req.files[1];
    var hash = createRandomHash();
    var proc = exec('java -jar ./jar/runner.jar ' + rev.path +' '+ nat.path+' '+'./results/'+hash+'.xlsx'+' '+ .2, function(err, stdo, stde){
        if(err){
            res.send('There was an error processing the request');
        } else {
            res.download('./results/'+hash+'.xlsx', hash+'.xlsx', function(err){
               if(err){
                   res.send('Application was unable to process your report.')
               } else {
                    clearFiles(hash, rev, nat);
               }
            });
        }
    });
    
});

app.listen(process.env.PORT || 8080, function(){
    console.log(require("fs").existsSync("./jar/runner.jar")?"its there":"its not there");
});


function createRandomHash(){
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
    return hash;
}

function clearFiles(hash, rev, nat){
    fs.unlink(__dirname + '/results/'+hash+'.xlsx', function(err){
        if(err){
            console.log(err);
        }
    });
    fs.unlink(__dirname + '/'+nat.path, function(err){
        if(err){
            console.log(err);
        }
    });
    fs.unlink(__dirname + '/'+rev.path, function(err){
        if(err){
            console.log(err);
        }
    });
}