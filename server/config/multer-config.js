var multer = require("multer");
var crypto = require("crypto");
var common = require(global.appRoot + '/server/common/serverfunctions.js');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, global.appRoot + '/tmp/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
        if(err){
            console.log('Error creating file hash');
            cb(null, common.createRandomHash() + '.' + require('mime').extension(file.mimetype));
        } else {
            cb(null, raw.toString('hex') + Date.now() + '.' + require('mime').extension(file.mimetype));
        }
    });
  }
});

var exp = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
        if(file.mimetype=='application/vnd.ms-excel' || file.mimetype=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});

module.exports = exp;