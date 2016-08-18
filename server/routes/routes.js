var common = require(global.appRoot +"/server/common/serverfunctions.js");
var upload = require(global.appRoot +"/server/config/multer-config.js");

var exec = require("child_process").exec;

module.exports = function(app){
    app.get('/', function(req, res){
        res.sendFile(global.appRoot + "/client/index.html");
    });
    
    app.get('/download', function(req, res){
        res.download(global.appRoot + '/server/jar/Location Revenue Per Pound.jar', 'Location Revenue Per Pound.jar', function(err){
            if(err){
                if(!res.headersSent){
                    res.send('Error occurred while downloading file');
                }
            } 
        });
    });
    
    app.post('/run', upload.array('reqFiles', 2) , function(req, res){
        var rev = req.files[0];
        var nat = req.files[1];
        if(rev==undefined || nat==undefined){
            rev = rev==undefined ? undefined : rev.path;
            nat = nat==undefined ? undefined : nat.path;
            common.deleteFiles(undefined, rev, nat);
            res.send('One or more files were invalid. Ensure that only xlsx or xls files are being used then try again.');
        } else {
            var hash = common.createRandomHash(); 
            var resultFileName = hash + '.xlsx';
            var resultFileLocation = global.appRoot + '/server/results/'+ resultFileName;
            exec('java -jar ./server/jar/runner.jar ' + rev.path +' '+ nat.path+' '+resultFileLocation+' '+ .2, function(err, stdo, stde){
                if(err){
                    rev = rev==undefined ? undefined : rev.path;
                    nat = nat==undefined ? undefined : nat.path;
                    common.deleteFiles(undefined, rev, nat);
                    res.send('There was an error processing the report. Please ensure the correct source files are being used then try again.');
                } else {
                    res.download(resultFileLocation, resultFileName, function(err){
                        common.deleteFiles(resultFileLocation, rev.path, nat.path);
                        if(err){
                            res.send('Application was unable to process your report for downloading.');
                        } 
                    });
                }
            });
        }
    });
};