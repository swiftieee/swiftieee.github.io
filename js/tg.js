// ========================================
// TELEGRAM IMAGE PRESENTATION
// ========================================

var tgButton = document.getElementById("tgButton");
var tgPresentation = document.getElementById("tgPresentation");
var tgImage = document.getElementById("tgImage");


// ========================================
// NEW IMAGE ARRAY
// ========================================

var tgImageArray = [
    "pic/tg/01.png",
    "pic/tg/02.png",
    "pic/tg/03.png",
    "pic/tg/04.png",
    "pic/tg/05.png"
    // Add more images here
];


// ========================================
// CURRENT IMAGE
// ========================================

var tgImageIndex = 0;


// ========================================
// CLICK TELEGRAM BUTTON
// ========================================

tgButton.addEventListener("click", function () {

    // Show presentation area
    tgPresentation.style.display = "flex";

    // Remove previous animation
    tgImage.classList.remove("show");

    // Small delay for animation
    setTimeout(function () {

        // Show current image
        tgImage.src = tgImageArray[tgImageIndex];

        tgImage.onload = function () {
            tgImage.classList.add("show");
        };

        // Move to next image
        tgImageIndex++;

        // Loop back to first image
        if (tgImageIndex >= tgImageArray.length) {
            tgImageIndex = 0;
        }

    }, 100);

});