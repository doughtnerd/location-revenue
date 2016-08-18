module.exports = {
    createRandomHash:function(){
        var current_date = (new Date()).valueOf().toString();
        var random = Math.random().toString();
        var hash = require("crypto").createHash('sha1').update(current_date + random).digest('hex');
        return hash;
    },
    deleteFiles:function(){
    for(var i = 0; i < arguments.length; i++){
        var file = arguments[i];
        if(file!==undefined){
            require("fs").unlink(file, function(err){
                if(err){
                    console.log(err);
                }
            });
        }
    }
}
};