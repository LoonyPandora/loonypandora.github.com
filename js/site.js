




// Workaround Safari issue where elements are not repainted
causeRepaintsOn = $("h1, a, img, section");

$(window).resize(function() {
    causeRepaintsOn.css("z-index", 1);
});
