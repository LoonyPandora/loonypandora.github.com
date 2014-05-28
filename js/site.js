"use strict";

$(document).ready(function () {
    getRecentTracks(12);

    setupPrism();

    // repaintOnResize("h1, h2, div, p, a, img, section, li");
    // FIXME: This is bed, remove it. It's Safari only, and should be only done on elements that need it
    $(window).resize(function() {
        forceRepaint()
    });


    var grid = new hashgrid();

    setupTrackClickHandler();

});


function setupPrism() {
    var automatic = setInterval(rotatePrism, 2000);

    $(".prism-viewport").on("click", function () {
        clearInterval(automatic);
        $(this).addClass("prism-transparent");
        rotatePrism();
    });
}

function rotatePrism () {
    var $container = $(".prism-viewport");

    if ($container.hasClass("show-front")) {
        $container.removeClass("show-front").addClass("show-top");
    } else if ($container.hasClass("show-bottom")) {
        $container.removeClass("show-bottom").addClass("show-front");
    } else if ($container.hasClass("show-back")) {
        $container.removeClass("show-back").addClass("show-bottom");
    } else if ($container.hasClass("show-top")) {
        $container.removeClass("show-top").addClass("show-back");
    }
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

    // Template for showing an individual track
    var $template = $("#recent-tracks-template").html();

    request.done(function (response) {
        $.each(response.recenttracks.track.reverse(), function (i, track) {
            renderTrack(track, $template);
        });
    });

    request.fail(function () {
        
    });
};


function renderTrack (track, $template) {
    // Check nowplaying / date played status
    // API will return double for an item that is now playing. So skip if it is
    var date;
    if (track.date) {
        date = track.date["#text"];
    } else {
        return true;
    }

    var momentDate = moment.utc(date, "DD MMM YYYY, HH:mm");

    $(".recent-tracks").append(
        Mustache.render($template, {
            url: track.url,
            artist: track.artist["#text"],
            track: track.name,
            humanDate: momentDate.format("ddd, MMM Do YYYY, h:mm a"),
            utcDate: momentDate.toISOString(),
            timeAgo: momentDate.fromNow(),
            thumbnail: track.image[2]["#text"],
            img: track.image[3]["#text"],
        })
    ).addClass("animated fadeIn");
}


function setupTrackClickHandler () {
    // Add the handler for showing / hiding metadata
    $(document).on("click", function(event) {
        var $target = $(event.target);

        // If we've clicked inside the recent tracks section...
        if ($target.parents().hasClass("recent-section")) {
            // If click was on the metadata block remove it
            if ($target.hasClass("recent metadata")) {
                hideTrackMetadata();
            }

            // Check if it's a track we've clicked on.
            if ($target.parents().hasClass("recent-tracks")) {
                showTrackMetadata($target);
            }
        } else {
            // Remove the metadata if the click was anywhere else
            hideTrackMetadata();
        }
    });
}


function hideTrackMetadata () {
    $(".recent.metadata").remove();
}

function showTrackMetadata ($track) {
    var $meta = $("#recent-tracks-metadata").html();

    var momentDate = moment.utc($track.attr("datetime"));

    // Remove any other metadata viewing blocks
    $(".recent.metadata").remove();

    $(".recent-section").append(
        Mustache.render($meta, {
            artist:     $track.data("artist"),
            track:      $track.data("track"),
            img:        $track.data("img") || $track.data("thumbnail"),
            timeAgo:    momentDate.fromNow()
        })
    );

    $(".recent.metadata").addClass("animated pulse");
}


// Workaround Safari issue where elements are not repainted
function forceRepaint() {
    var ss = document.styleSheets[0];
    try {
        ss.addRule('.xxxxxx', 'position: relative');
        ss.removeRule(ss.rules.length - 1);
    } catch(e) {}
}

function repaintOnResize (selector) {
    $(window).resize(function() {
        $(selector).css("z-index", 1);
    });
}
