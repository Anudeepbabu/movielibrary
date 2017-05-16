var search_box = document.getElementById('search_box');
var awesomplete = new Awesomplete(search_box, {list: []});
$("body").get(0).addEventListener("awesomplete-selectcomplete", function(){
    $('#int-search-button').click();
}, true);

$('#search_box').keyup(function(e){
    var q = $(this).val();
    q = q.split(',');
    q = q[q.length - 1];

    if(q.length >= 2){
        var language = $('#language').val();
        var names = [];
        var movie_file = document.createElement('script');
        movie_file.type = 'application/javascript';
        movie_file.src = 'lists/' + language + '.js';
        movie_file.onload = function(){
            for(var i = movies.length - 1; i >= 0; i--){
                var movie = movies[i];
                names = names.concat(movie['s']).concat(movie['d']).concat([movie['n']]);
            }
            var new_names = names.filter(function(item, pos){
                return names.indexOf(item) == pos;
            });

            awesomplete.list = new_names.sort();
        };

        document.body.appendChild(movie_file);
    }
});


//Search
$('#int-search-button').keyup(function(e){
    if(e.keyCode == 13){
        $(this).click();
    }
});

$('#int-search-button').click(function(){
    var search_page = "search.html?" + $('#search_form').serialize();
    window.location.href = search_page;
});

function search_movies(){
    var href = window.location.href;
    var query_string = href.split('?');
    try{
        var params = extract_params(query_string[1]);
    }
    catch(e){
        var params = false;
    }
    if(params != false){
        //get params
        var query = decode_param(params['search_box']).toLowerCase();
        var language = decode_param(params['language']).toLowerCase();
        var release_year = decode_param(params['release_year']);
        var genre = decode_param(params['genre']).toLowerCase();

        //populate search fields
        $('#search_box').val(query);
        $('#language option[value="'+ language +'"]').attr('selected', '');
        $('#release_year option[value="'+ release_year +'"]').attr('selected', '');
        $('#genre option[value="'+ genre +'"]').attr('selected', '');

        query = decode_param(params['search_box']).toLowerCase() || false;
        release_year = decode_param(params['release_year']) || 0;
        genre = decode_param(params['genre']).toLowerCase() || false;

        //show interstital
        $('#modal').css('display', 'block');

        //perform search
        var movie_file = document.createElement('script');
        movie_file.type = 'application/javascript';
        movie_file.src = 'lists/' + language + '.js';
        movie_file.onload = function(){
            //var movies loaded from the movie_file
            var content = '';
            var count = 0;
            for(var i = movies.length - 1; i >= 0; i--){
                var movie = movies[i];
                var include = false;

                //release_year
                if(movie['y'] == release_year){
                    include = true;
                }

                //genre
                for (var j = movie['g'].length - 1; j >= 0; j--) {
                    if(movie['g'][j].toLowerCase().indexOf(genre) >= 0){
                        include = true;
                    }
                }

                //names
                var items = movie['s'].concat(movie['d']).concat([movie['n']]);
                for (var k = items.length - 1; k >= 0; k--){
                    var item = items[k];
                    if(query && item.toLowerCase().indexOf(query) >= 0){
                        include = true;
                    }    
                }

                //catch all
                console.log(query, genre, release_year)
                if(query == false && (genre == false || genre == 'undefined') && (release_year == 0 || release_year == 'undefined')){
                    include = true;
                }

                if(include == true){
                    content = content + '<div class="col-sm-3 col-xs-6 int-video-result"><a target="_BLANK" href="'+ movie['l'] +'"><img src="'+ movie['t'] +'"><div>'+ movie['n'] +'</div></a></div>';
                    count = count + 1;
                }
            }

            if(count == 0){
                content = '<div class="row"><div class="col-sm-12 col-xs-12"><span class="int-heading-2">No videos found</span></div></div><div class="row int-vert-spacer-div hidden-xs"></div><div id="int-results" class="row">' + content + '</div>';
            }
            else if(count == 1){
                content = '<div class="row"><div class="col-sm-12 col-xs-12"><span class="int-heading-2">Found 1 video</span></div></div><div class="row int-vert-spacer-div hidden-xs"></div><div id="int-results" class="row">' + content + '</div>';
            }
            else{
                content = '<div class="row"><div class="col-sm-12 col-xs-12"><span class="int-heading-2">Found '+ count +' videos</span></div></div><div class="row int-vert-spacer-div hidden-xs"></div><div id="int-results" class="row">' + content + '</div>';
            }

            $('#content').html(content);
        };

        document.body.appendChild(movie_file);

        //modify page title and description
        var new_title = 'Watch ' + ucwords(params['language']);
        if(params['genre']){
            new_title = new_title + ' ' + ucwords(params['genre']);
        }
        new_title = new_title + ' Movies';
        var new_desc = new_title;
        new_title = new_title + ' for Free - MovieLibrary.org';
        if(params['search_box']){
            new_desc = new_desc + ' of ' + ucwords(decode_param(params['search_box']));
        }
        new_desc = new_desc + ' uploaded to Youtube and other popular video sharing sites';
        
        document.title = new_title;
        $('meta[name=description]').attr('content', new_desc);

        $('#modal').css('display', 'none');
    }
}




