var btn = document.getElementById("heartTxt");
var tgButtonContainer = document.getElementById("tgButtonContainer");
var tgButton = document.getElementById("tgButton");
var tgPresentation = document.getElementById("tgPresentation");
var analyticsPages = document.querySelectorAll(".analyticsPage");
var analyticsPrev = document.getElementById("analyticsPrev");
var analyticsNext = document.getElementById("analyticsNext");
var analyticsDots = document.getElementById("analyticsDots");
var analyticsClose = document.getElementById("analyticsClose");

var btnVal = 0;
var analyticsIndex = 0;
var analyticsOpen = false;
var imageStarted = false;


/* =========================================
   SPOTIFY PLAYER
   ========================================= */

var spotifyController = null;
var spotifyReady = false;


/*
 * IMPORTANT:
 * Define the callback BEFORE loading Spotify's API.
 * This prevents the API from loading before our
 * callback is ready.
 */
window.onSpotifyIframeApiReady = function (IFrameAPI) {

    var spotifyElement = document.getElementById("spotifyPlayer");

    if (!spotifyElement) {
        console.error("Spotify container #spotifyPlayer was not found.");
        return;
    }

    console.log("Spotify IFrame API is ready.");

    var options = {
        width: "1",
        height: "1",
        uri: "spotify:playlist:1luLkKedINnD6X0XKBFtCy"
    };

    IFrameAPI.createController(
        spotifyElement,
        options,
        function (EmbedController) {

            spotifyController = EmbedController;
            spotifyReady = true;

            console.log("Spotify player is ready.");

            /*
             * Attempt autoplay when the page loads.
             *
             * Edge/browser autoplay policies may block this.
             * If blocked, the heart button below will attempt
             * playback again using a real user interaction.
             */
            try {
                EmbedController.play();
                console.log("Spotify autoplay attempt sent.");
            } catch (error) {
                console.log("Spotify autoplay was blocked:", error);
            }

            /*
             * Helpful debugging events.
             */
            EmbedController.addListener(
                "playback_started",
                function (event) {
                    console.log(
                        "Spotify playback started:",
                        event.data.playingURI
                    );
                }
            );

            EmbedController.addListener(
                "playback_update",
                function (event) {
                    console.log(
                        "Spotify playback:",
                        event.data.isPaused
                            ? "paused"
                            : "playing"
                    );
                }
            );
        }
    );
};


/*
 * Load Spotify AFTER the callback above exists.
 */
(function loadSpotifyAPI() {

    var existingScript = document.querySelector(
        'script[src="https://open.spotify.com/embed/iframe-api/v1"]'
    );

    /*
     * If the HTML still contains the Spotify API script,
     * don't load it a second time.
     */
    if (existingScript) {
        console.log("Spotify API script already exists.");
        return;
    }

    var script = document.createElement("script");

    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;

    script.onload = function () {
        console.log("Spotify API script loaded.");
    };

    script.onerror = function () {
        console.error("Could not load Spotify IFrame API.");
    };

    document.head.appendChild(script);

})();





/* =========================================
   ANALYTICS DATA
   ========================================= */

var monthlyData = [
    ["Jan", 62328, 56652],
    ["Feb", 37240, 36538],
    ["Mar", 52352, 52168],
    ["Apr", 52512, 48721],
    ["May", 47642, 45346],
    ["Jun", 49542, 45868],
    ["Jul", 44087, 41004],
    ["Aug", 49243, 44669],
    ["Sep", 48614, 42739],
    ["Oct", 61177, 52719],
    ["Nov", 71885, 59285],
    ["Dec", 63313, 56473]
];

var hourlyData = [
    ["00", 35724, 33223],
    ["01", 38982, 36215],
    ["02", 38772, 34665],
    ["03", 39716, 35962],
    ["04", 41250, 36934],
    ["05", 35092, 29585],
    ["06", 30854, 25305],
    ["07", 23102, 18775],
    ["08", 19441, 16459],
    ["09", 15887, 14512],
    ["10", 17119, 15921],
    ["11", 17865, 16538],
    ["12", 21412, 19102],
    ["13", 21884, 19958],
    ["14", 22652, 20700],
    ["15", 19385, 18306],
    ["16", 18149, 16813],
    ["17", 18363, 17268],
    ["18", 20535, 19814],
    ["19", 22287, 21467],
    ["20", 25945, 24617],
    ["21", 28014, 26333],
    ["22", 32377, 30628],
    ["23", 34678, 33082]
];



/* =========================================
   POLAROID
   ========================================= */

function clearMainImage() {

    myImage.setAttribute("src", "");

    myTxt.innerHTML = "";

    document.getElementById("imgTxt").style.opacity = 0;

    document.getElementById("typeDiv").style.opacity = 0;
}


function showNextPolaroid() {

    closeAnalytics();

    clearMainImage();

    setTimeout(function () {

        myImage.setAttribute(
            "src",
            imageArray[imageIndex]
        );

        myTxt.innerHTML = txtArray[imageIndex];

        document.getElementById(
            "imgTxt"
        ).style.opacity = 1;

        imageIndex++;

        if (imageIndex >= len) {
            imageIndex = 0;
        }

    }, 180);

    imageStarted = true;

    t++;
}


/*
 * HEART BUTTON
 *
 * This is the important part:
 *
 * 1. Try to start Spotify.
 * 2. Show the next Polaroid.
 */
function play() {

    showNextPolaroid();
}



/* =========================================
   BUTTON FADE-IN
   ========================================= */

function buttonFadeIn() {

    if (btnVal < 1) {

        btnVal += 0.025;

        btn.style.opacity = btnVal;

        tgButtonContainer.style.opacity = btnVal;

        /*
         * Enable BOTH buttons.
         */
        btn.style.pointerEvents = "auto";

        tgButtonContainer.style.pointerEvents = "auto";

    } else {

        btnVal = 1;

        btn.style.opacity = 1;

        tgButtonContainer.style.opacity = 1;

        btn.style.pointerEvents = "auto";

        tgButtonContainer.style.pointerEvents = "auto";

        clearInterval(buttonInterval);
    }
}



/* =========================================
   ANALYTICS CHARTS
   ========================================= */

function buildChart(targetId, data, compact) {

    var target = document.getElementById(targetId);

    if (!target) return;

    var max = 0;

    data.forEach(function(row) {

        max = Math.max(
            max,
            row[1] + row[2]
        );

    });

    target.innerHTML = "";

    data.forEach(function(row) {

        var group = document.createElement("div");

        group.className = "chartGroup";

        var bars = document.createElement("div");

        bars.className = "chartBars";

        [row[1], row[2]].forEach(
            function(value, index) {

                var bar =
                    document.createElement("div");

                bar.className =
                    index === 0
                        ? "chartBar chartRupert"
                        : "chartBar chartReese";

                bar.style.height =
                    Math.max(
                        4,
                        (value / max) * 100
                    ) + "%";

                bar.title =
                    (index === 0
                        ? "Rupert: "
                        : "Reese: ") +
                    value.toLocaleString();

                bars.appendChild(bar);
            }
        );

        var label =
            document.createElement("span");

        label.className = "chartLabel";

        label.textContent = row[0];

        group.appendChild(bars);

        group.appendChild(label);

        target.appendChild(group);
    });
}



/* =========================================
   ANALYTICS PAGES
   ========================================= */

function showAnalyticsPage(index) {

    analyticsIndex =
        (index + analyticsPages.length) %
        analyticsPages.length;

    analyticsPages.forEach(
        function(page, i) {

            page.classList.toggle(
                "active",
                i === analyticsIndex
            );

        }
    );

    analyticsDots
        .querySelectorAll("button")
        .forEach(
            function(dot, i) {

                dot.classList.toggle(
                    "active",
                    i === analyticsIndex
                );

            }
        );
}



function openAnalytics() {

    clearMainImage();

    analyticsOpen = true;

    tgPresentation.style.display = "flex";

    tgPresentation.setAttribute(
        "aria-hidden",
        "false"
    );

    document.getElementById(
        "typeDiv"
    ).style.opacity = 0;

    showAnalyticsPage(analyticsIndex);
}



function closeAnalytics() {

    analyticsOpen = false;

    tgPresentation.style.display = "none";

    tgPresentation.setAttribute(
        "aria-hidden",
        "true"
    );
}



/* =========================================
   TELEGRAM / ANALYTICS BUTTON
   ========================================= */

tgButton.addEventListener(
    "click",
    function() {

        if (!analyticsOpen) {

            openAnalytics();

        } else {

            showAnalyticsPage(
                analyticsIndex + 1
            );

        }

    }
);



/* =========================================
   ANALYTICS NAVIGATION
   ========================================= */

analyticsNext.addEventListener(
    "click",
    function(e) {

        e.stopPropagation();

        showAnalyticsPage(
            analyticsIndex + 1
        );

    }
);


analyticsPrev.addEventListener(
    "click",
    function(e) {

        e.stopPropagation();

        showAnalyticsPage(
            analyticsIndex - 1
        );

    }
);


analyticsClose.addEventListener(
    "click",
    function(e) {

        e.stopPropagation();

        closeAnalytics();

    }
);



/* =========================================
   ANALYTICS DOTS
   ========================================= */

analyticsPages.forEach(
    function(_, i) {

        var dot =
            document.createElement("button");

        dot.type = "button";

        dot.setAttribute(
            "aria-label",
            "Analytics page " + (i + 1)
        );

        dot.addEventListener(
            "click",
            function(e) {

                e.stopPropagation();

                showAnalyticsPage(i);

            }
        );

        analyticsDots.appendChild(dot);
    }
);



/* =========================================
   INITIALIZE ANALYTICS
   ========================================= */

buildChart(
    "monthChart",
    monthlyData,
    false
);

buildChart(
    "hourChart",
    hourlyData,
    true
);

showAnalyticsPage(0);



/* =========================================
   WAIT FOR TYPEWRITER
   ========================================= */

function event() {

    var waitForType =
        setInterval(
            function() {

                if (ok == 3) {

                    clearInterval(waitForType);

                    setTimeout(
                        function() {

                            buttonInterval =
                                setInterval(
                                    buttonFadeIn,
                                    50
                                );

                        },
                        1000
                    );
                }

            },
            50
        );
}


var buttonInterval;

event();