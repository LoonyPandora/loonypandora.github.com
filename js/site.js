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
});


function setupPrism() {
    var $container = $(".prism-viewport");

    var rotations = -1;

    $(".rotate-up").on("click", function () {
        rotations++;
        rotatePrismUp($container, rotations);
    });

    $(".prism-viewport").on("click", function () {
        rotations++;
        rotatePrismUp($container, rotations);
    });

    $(".rotate-down").on("click", function () {
        rotations++;
        rotatePrismDown($container, rotations);
    })
}

function rotatePrismUp ($container, rotations) {
    rotations++;

    if (rotations % 4 === 0) {
        $container.toggleClass("prism-transparent");
    }

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

function rotatePrismDown ($container, rotations) {
    rotations++;

    if (rotations % 4 === 0) {
        $container.toggleClass("prism-transparent");
    }

    if ($container.hasClass("show-front")) {
        $container.removeClass("show-front").addClass("show-bottom");
    } else if ($container.hasClass("show-bottom")) {
        $container.removeClass("show-bottom").addClass("show-back");
    } else if ($container.hasClass("show-back")) {
        $container.removeClass("show-back").addClass("show-top");
    } else if ($container.hasClass("show-top")) {
        $container.removeClass("show-top").addClass("show-front");
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
                humanDate: momentDate.format("ddd, MMM Do YYYY, h:mm a"),
                utcDate: momentDate.toISOString(),
                timeAgo: momentDate.fromNow(),
                thumbnail: track.image[2]["#text"],
                img: track.image[3]["#text"],
            });

            $(".recent-tracks").append(
                Mustache.render($template, renderData[i])
            );
        });

        $(".recent-tracks li a").on("click", function () {
            var $meta = $("#recent-tracks-metadata").html();

            var momentDate = moment.utc($(this).attr("datetime"));

            $(".recent.metadata").remove();

            $(".recent-section").append(
                Mustache.render($meta, {
                    artist: $(this).data("artist"),
                    track: $(this).data("track"),
                    img: $(this).data("img") || $(this).data("thumbnail"),
                    timeAgo: momentDate.fromNow()
                })
            );

            // $(".recent-tracks li.selected").remove();
            // $(this).parent("li").clone().addClass("selected").appendTo(".recent-tracks");
        });

        // $(".recent-tracks li.selected a").on("click", function () {
        //     console.log(this);
        //     $(this).parent("li").removeClass("selected");
        // });

        // Add the metadata about the currently playing track and show it
        // $(".recent-tracks").append(
        //     Mustache.render($("#recent-tracks-metadata").html(), renderData.slice(-1)[0])
        // ).addClass("animated fadeIn");

    });

    request.fail(function () {
        
    });
};



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
