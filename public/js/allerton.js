const navBar = document.getElementById("navbar");
const fakeNav = document.getElementById("fake-nav");
const footer = document.getElementById("footer");
const video = document.getElementById("homeVideo");
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

function hideVideoControls() {
    if (video) {
        video.controls = false;
    }
}

hideVideoControls();

// When the user scrolls the page, execute myFunction
window.onscroll = function() {
    navScroll();
};

$('.close-alert').click(function() {
    $(this).parents(':eq(1)').remove();
});


$('.role p').each(function(index, element) {
    $clamp(element, { clamp: 3, useNativeClamp: false });
});