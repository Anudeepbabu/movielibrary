var extract_params = function(params_string){
    var params = {};
    var raw_params = params_string.split('&');
    
    var j = 0;
    var len = raw_params.length;
    for(var i=0; i<len; i++){
        var url_params = raw_params[i].split('=');
        if(url_params.length == 2){
            params[url_params[0]] = url_params[1];
        }
        else if(url_params.length == 1){
            params[j] = url_params[0];
            j += 1;
        }
        else{
            //param not readable. pass.
        }
    }

    return params;
};

var decode_param = function(str){
    str = decodeURIComponent(str);
    str = str.split('+').join(' ');
    return str;
};

var ucwords = function(str){
    new_str = str.split(' ');
    try{
        new_str.forEach(function(e, i, arr){
            arr[i] = e.charAt(0).toUpperCase() + e.slice(1);
        });
    }
    catch(e){}
    
    return new_str.join(' ');
};