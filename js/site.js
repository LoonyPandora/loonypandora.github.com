"use strict";

$(document).ready(function () {
    $("body").click(function () {
        $(".recent-tracks li").removeClass("selected");
    });

    getRecentTracks(10);
    
    repaintOnResize("h1, a, img, section");
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
                img: track.image[2]["#text"],
            };

            $(".recent-tracks").append(
                Mustache.render($template, renderData)
            );
        });

        $(".recent-tracks").addClass("animated fadeIn");
    });

    request.fail(function () {
        
    });
};



// Workaround Safari issue where elements are not repainted
function repaintOnResize (selector) {
    $(window).resize(function() {
        $(selector).css("z-index", 1);
    });
}
