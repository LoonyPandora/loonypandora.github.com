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
    getFollowers();
    getRepos();
    getFeed();
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

        $.each(response.topartists.artist, function (i, artist) {
            var renderData = {
                url: artist.url,
                name: artist.name,
                img: artist.image[1]["#text"]
            };

            $(".top-artists").append(
                Mustache.render($template, renderData)
            );
        });

        $(".top-artists").addClass("animated fadeInDown");
    });


    request.fail(function () {
        
    });


};



function getFollowers () {
    var request = $.ajax({
        dataType: "json",
        url: "https://api.github.com/users/LoonyPandora/followers",
        type: "GET"
    });
    
    
    request.done(function (response) {
        var $template = $("#followers-template").html();

        var renderData = {
            follower_count: response.length
        };

        $(".followers").append(
            Mustache.render($template, renderData)
        ).addClass("animated fadeInDown");;
    })

    request.fail(function () {
        console.log(arguments);
    })
}



function getRepos () {
    var request = $.ajax({
        dataType: "json",
        url: "https://api.github.com/users/LoonyPandora/repos",
        type: "GET"
    });
    
    
    request.done(function (response) {
        var $template = $("#repos-template").html();

        var renderData = {
            repo_count: response.length
        };

        $(".followers").append(
            Mustache.render($template, renderData)
        ).addClass("animated fadeInDown");
    })
    

    request.fail(function () {
        console.log(arguments);
    })
}



function getFeed () {
    var request = $.ajax({
        dataType: "jsonp",
        url: "https://github.com/LoonyPandora.json",
        type: "GET"
    });


    request.done(function (response) {
        var $template = $("#feed-template").html();

        $.each(response, function (i, event) {
            if (i === 5) {
                return false;
            }
            // console.log(i);
            var renderData = {
                created_at: event.created_at,
                type: event.type,
                repo: {
                    url: event.repository.url,
                    name: event.repository.name
                }
            };

            $(".feed").append(
                Mustache.render($template, renderData)
            );
        });

        $(".feed").addClass("animated fadeInDown");
    })
    

    request.fail(function () {
        console.log(arguments);
    })
}

