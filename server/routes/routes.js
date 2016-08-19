var common = require(global.appRoot +"/server/common/serverfunctions.js");
var upload = require(global.appRoot +"/server/config/multer-config.js");
var exec = require("child_process").exec;

module.exports = function(app){
    var settings = {};
    
    app.get('/', function(req, res){
        if(req.session.loggedIn == undefined || req.session.loggedIn ==false){
            res.redirect('/login');
        } else {
            res.render(global.appRoot + '/client/index');
        }
    });
    
    app.get('/login', function(req, res){
        if(req.session.loggedIn){
            res.redirect('/')
        } else {
            res.render(global.appRoot + '/client/login');
        }
    });
    
    app.post('/login', function(req, res){
        if(req.body.username=='alsco' && req.body.password=='branch'){
            req.session.loggedIn = true;
            res.redirect('/');
        } else {
            res.send('Incorrect');
        }
    });
    
    app.get('/download', function(req, res){
        res.download(global.appRoot + '/server/jar/Location Revenue Per Pound.jar', 'Location Revenue Per Pound.jar', function(err){
            if(err){
                if(!res.headersSent){
                    settings.msg='Error occurred while downloading file';
                    res.render('errorpage', settings);
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
            console.log('Error with upload, deleting files');
            common.deleteFiles(undefined, rev, nat);
            settings.msg='One or more files were invalid. Ensure that only xlsx or xls files are being used then try again.';
            res.render('errorpage', settings);
        } else {
            var hash = common.createRandomHash(); 
            var resultFileName = hash + '.xlsx';
            var resultFileLocation = global.appRoot + '/server/results/'+ resultFileName;
            console.log('executing jar...');
            exec('java -jar '+global.appRoot+'/server/jar/runner.jar ' + rev.path +' '+ nat.path+' '+resultFileLocation+' '+ .2, function(err, stdo, stde){
                if(err){
                    rev = rev==undefined ? undefined : rev.path;
                    nat = nat==undefined ? undefined : nat.path;
                    console.log('Error occurred while executing jar, deleting files.')
                    common.deleteFiles(undefined, rev, nat);
                    settings.msg='There was an error processing the report. Please ensure the correct source files are being used then try again.';
                    res.render('errorpage', settings);
                } else {
                    res.download(resultFileLocation, resultFileName, function(err){
                        common.deleteFiles(resultFileLocation, rev.path, nat.path);
                        if(err){
                            settings.msg = 'Application was unable to process your report for downloading.';
                            res.render('errorpage', settings);
                        } 
                    });
                }
            });
        }
    });
};