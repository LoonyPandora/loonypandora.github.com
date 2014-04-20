"use strict";

$(document).ready(function () {

    skrollr.init({
        forceHeight: false
    });

    $("body").noisy({
        intensity:  0.005, 
        size:       500, 
        opacity:    0.4, 
        fallback:   "", 
        monochrome: true
    });

    getRecentTracks(6);
});


function getRecentTracks (limit) {
    var recentTracksURL = "http://ws.audioscrobbler.com" +
                          "/2.0" + 
                          "/?method=user.getrecenttracks" + 
                          "&user=LoonyPandora" + 
                          "&format=json" + 
                          "&limit=" + limit + 
                          "&api_key=c1e48cba96f019d566438bd5e7f1591f";

    var request = $.ajax({
        dataType: "json",
        url: recentTracksURL,
        type: "GET"
    });

    request.done(function (response) {
        var $template = $("#recent-tracks-template").html();

        $.each(response.recenttracks.track, function (i, track) {
            // Check nowplaying / date played status
            // API will return double for an item that is now playing. So skip if it is
            var date;
            if (track.date) {
                date = track.date["#text"];
            } else {
                return true;
            }

            var renderData = {
                url: track.url,
                artist: track.artist["#text"],
                track: track.name,
                album: track.album["#text"],
                date: date,
                img: track.image[1]["#text"],
            };

            $(".recent-tracks").append(
                Mustache.render($template, renderData)
            );
        });

        $(".recent-tracks").addClass("animated fadeInDown");
    });


    request.fail(function () {
        
    });


};

