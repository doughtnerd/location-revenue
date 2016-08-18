$(document).ready(function(){
    $('#submit-button').bind('click', function(){
        var hasFiles = checkFileFields();
        var validExt = false;
        if(hasFiles){
            validExt = checkExtensions();
        }
        return hasFiles && validExt;
    });
});

function checkFileFields(){
    if(!$("#rev-report").val()){
        $('#rev-report').parent().addClass('has-error');
        alert("No file Revenue Report file selected");
        return false;
    } else {
        $('#rev-report').parent().removeClass('has-error');
        $('#rev-report').parent().addClass('has-success');
    }
    if(!$('#nat-report').val()){
        $("#nat-report").parent().addClass('has-error');
        alert("No National Account file selected");
        return false;
    } else {
        $("#nat-report").parent().removeClass('has-error');
        $("#nat-report").parent().addClass('has-success');
    }
    return true;
}

function checkExtensions(){
    if(checkExtension($("#rev-report").val()) && checkExtension($('#nat-report').val())){
        return true;
    }
    alert('Files must be of type xls or xlsx');
    return false;
}

function checkExtension(file){
    var extension = file.substr( (file.lastIndexOf('.') +1) );
    if(extension=='xls' || extension=='xlsx'){
        return true
    }
    return false;
}