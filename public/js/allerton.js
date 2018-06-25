const navBar = document.getElementById("navbar");
const fakeNav = document.getElementById("fake-nav");
const footer = document.getElementById("footer");
const navHeight = 56;

function navScroll() {

    var stickyNav = navBar.offsetTop + navHeight + 30;

    if (window.pageYOffset >= stickyNav) {
        navBar.classList.add("sticky", "animated", "fadeInDown");
        fakeNav.style = "display: block;"
    } else {
        navBar.classList.remove("sticky", "animated", "fadeInDown");
        fakeNav.style = "display: none;"
    }
}


// When the user scrolls the page, execute myFunction
window.onscroll = function() {
    navScroll();
};