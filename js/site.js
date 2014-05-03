






// Workaround Safari issue where elements are not repainted
causeRepaintsOn = $("h1, h2, h3, p, section");

$(window).resize(function() {
    causeRepaintsOn.css("z-index", 1);
});
