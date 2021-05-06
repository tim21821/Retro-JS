const ITEMS = document.querySelectorAll(".item");
var l = ITEMS.length;

for (var i = 0; i < l; i++) {
    ITEMS[i].addEventListener("mouseover", darkening);
    ITEMS[i].addEventListener("mouseout", revDarkening);
}

function darkening() {
    this.childNodes[1].classList.add("img-darken");
}

function revDarkening() {
    this.childNodes[1].classList.remove("img-darken");
}