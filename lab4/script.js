var colorSchemes = [
    { bg: "#1e3a5f", color: "#ffffff" },
    { bg: "#ffe08a", color: "#222222" },
    { bg: "", color: "" }
];
var textStep = 0;
var linkStep = 0;

// getElementById()
document.getElementById("city-description").addEventListener("click", function () {
    var el = document.getElementById("city-description");
    var scheme = colorSchemes[textStep % colorSchemes.length];
    el.style.backgroundColor = scheme.bg;
    el.style.color = scheme.color;
    textStep++;
});

// querySelector()
document.querySelector(".city-link").addEventListener("click", function () {
    var el = document.querySelector(".city-link");
    var scheme = colorSchemes[linkStep % colorSchemes.length];
    el.style.backgroundColor = scheme.bg;
    el.style.color = scheme.color;
    linkStep++;
});

var IMG_SRC = "https://img.tsn.ua/cached/421/tsn-1284f5ef/thumbs/1200x630/96/38/2fe2f06b90af05b5cb64db8ad5f53896.jpg";
var SIZE_STEP = 50;
var MIN_WIDTH = 100;

function getLastImage() {
    var images = document.images;
    return images.length ? images[images.length - 1] : null;
}

document.getElementById("btn-add").addEventListener("click", function () {
    var img = document.createElement("img");
    img.src = IMG_SRC;
    img.alt = "Панорама Києва";
    img.width = 600;
    document.getElementById("gallery").appendChild(img);
});

document.getElementById("btn-grow").addEventListener("click", function () {
    var img = getLastImage();
    if (img) {
        img.width = img.width + SIZE_STEP;
    }
});

document.getElementById("btn-shrink").addEventListener("click", function () {
    var img = getLastImage();
    if (img) {
        img.width = Math.max(MIN_WIDTH, img.width - SIZE_STEP);
    }
});

document.getElementById("btn-delete").addEventListener("click", function () {
    var img = getLastImage();
    if (img) {
        img.remove();
    }
});