"use strict";

$(document).ready(function () {
    $("body").click(function () {
        $(".recent-tracks li").removeClass("selected");
    });

    getRecentTracks(9);

    repaintOnResize("h1, h2, div, button, a, img, section, li");


    setupPrismToggles();
});


function setupPrismToggles() {
    var $container = $(".prism-viewport");

    $(".rotate-up").on("click", function () {
        if ($container.hasClass("show-front")) {
            $container.removeClass("show-front").addClass("show-top");
        } else if ($container.hasClass("show-bottom")) {
            $container.removeClass("show-bottom").addClass("show-front");
        } else if ($container.hasClass("show-back")) {
            $container.removeClass("show-back").addClass("show-bottom");
        } else if ($container.hasClass("show-top")) {
            $container.removeClass("show-top").addClass("show-back");
        }
    })

    $(".rotate-down").on("click", function () {
        if ($container.hasClass("show-front")) {
            $container.removeClass("show-front").addClass("show-bottom");
        } else if ($container.hasClass("show-bottom")) {
            $container.removeClass("show-bottom").addClass("show-back");
        } else if ($container.hasClass("show-back")) {
            $container.removeClass("show-back").addClass("show-top");
        } else if ($container.hasClass("show-top")) {
            $container.removeClass("show-top").addClass("show-front");
        }
    })

    $(".toggle-backface-visibility").on("click", function () {
        $container.toggleClass("prism-transparent");
    })

}










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

        var renderData = [];

        $.each(response.recenttracks.track.reverse(), function (i, track) {
            // Check nowplaying / date played status
            // API will return double for an item that is now playing. So skip if it is
            var date;
            if (track.date) {
                date = track.date["#text"];
            } else {
                return true;
            }

            var momentDate = moment.utc(date, "DD MMM YYYY, HH:mm");

            renderData.push({
                url: track.url,
                artist: track.artist["#text"],
                track: track.name,
                album: track.album["#text"],
                date: momentDate.format("ddd, MMM Do YYYY, h:mm a"),
                humanDate: momentDate.fromNow(),
                img: track.image[2]["#text"],
            });

            $(".recent-tracks").append(
                Mustache.render($template, renderData[i])
            );
        });

        // Add the metadata about the currently playing track and show it
        $(".recent-tracks").append(
            Mustache.render($("#recent-tracks-metadata").html(), renderData.slice(-1)[0])
        ).addClass("animated fadeIn");

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
