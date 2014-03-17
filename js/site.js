"use strict";

$(document).ready(function () {

    // $("body").stellar();

    // $("body").noisy({
    //     intensity: 1,
    //     size: 200,
    //     opacity: 0.1,
    //     randomColors: false,
    //     color: '#ffffff'
    // });

    getTopArtists();

});



function getTopArtists () {
    var topArtistURL = "http://ws.audioscrobbler.com" +
                        "/2.0" + 
                        "/?method=user.gettopartists" + 
                        "&user=LoonyPandora" + 
                        "&format=json" + 
                        "&period=1month" + 
                        "&limit=5" + 
                        "&api_key=c1e48cba96f019d566438bd5e7f1591f";

    var request = $.ajax({
        dataType: "json",
        url: topArtistURL,
        type: "GET"
    });

    request.done(function (response) {
        var $template = $("#top-artists-template").html();

        $.each(response.topartists.artist,
            function (i, artist) {
        
                var renderData = {
                    url: artist.url,
                    name: artist.name,
                    img: artist.image[1]["#text"]
                };
        
                $(".top-artists").append(
                    Mustache.render($template, renderData)
                );
            }
        );

        $(".top-artists").addClass("animated fadeIn");
    });
    
    
    
    
    
    request.fail(function () {
        
    });


};



function getRepos () {
    // https://api.github.com/users/LoonyPandora/followers
}

