// ID
const navBar = document.getElementById("navbar");
const fakeNav = document.getElementById("fake-nav");
const footer = document.getElementById("footer");
const indJobCap = document.getElementById("ind-job-cap");
const indJobDesc = document.getElementById("ind-job-desc");
const instagram = document.getElementById("instagram");

var jobHead;
var indJob;
var indJobCap_Rec;
var applyFromTop;
var applyFromBottom;

const navHeight = 56;

// const indJobDesc_Rec = indJobDesc.getBoundingClientRect();
if (indJobCap) {
    indJobCap_Rec = indJobCap.getBoundingClientRect();
    jobHead = document.getElementsByClassName('job-heading');
    indJob = document.getElementsByClassName('individual-job');
}

function getStyle(oElm, strCssRule){
    var strValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle){
        strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    }
    else if(oElm.currentStyle){
        strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
            return p1.toUpperCase();
        });
        strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
}

function navScroll() {

    if(navBar) {
        var stickyNav = navBar.offsetTop + navHeight + 30;

        if (window.pageYOffset >= stickyNav) {
            navBar.classList.add("sticky", "animated", "fadeInDown");
            fakeNav.style = "display: block;"
        } else {
            navBar.classList.remove("sticky", "animated", "fadeInDown");
            fakeNav.style = "display: none;"
        }
    }
}


function jobCapScroll() {

    if (indJobCap) {

        function reset() {
            indJobCap.classList.remove("sticky", "sticky-bottom");
            indJobDesc.classList.remove("offset-4");
            indJobCap.style.width = "inherit";
        }

        reset();

        var jobHeadingHeight = jobHead[0].offsetHeight;
        var jobSectionPadding = getStyle(document.getElementById("individual-job"), "padding-top");

        applyFromTop =  (jobHeadingHeight + parseInt(jobSectionPadding) - 30);

        var capH = indJobCap.childNodes[1].offsetHeight;
        var footH = footer.offsetHeight;
        var bodPadd = parseInt(jobSectionPadding);
        var docH = document.documentElement.scrollHeight;
        var tRem = capH + footH + bodPadd;
        var bottom = footH + capH;

        applyFromBottom = docH - (tRem + 83);

        window.onscroll = function() {

            navScroll();

            if (window.pageYOffset >= applyFromTop && window.pageYOffset < applyFromBottom) {
                indJobCap.classList.remove("sticky-bottom");
                indJobCap.classList.add("sticky");
                indJobDesc.classList.add("offset-4");
                indJobCap.style.width = indJobCap_Rec.width + "px";
            } else if (window.pageYOffset >= applyFromBottom) {
                indJobCap.classList.remove("sticky");
                indJobCap.classList.add("sticky-bottom");
            } else {
                reset();
            }
        }

    }
}


// When the user scrolls the page, execute myFunction
window.onscroll = function() {
    navScroll();
};

if (indJobCap) {
    window.onresize = function() {
        indJobCap_Rec = indJobCap.getBoundingClientRect();
        jobCapScroll();
    };
}

$('.close-alert').click(function() {
    $(this).parents(':eq(1)').remove();
});

$(function() {
    if ($('.froala').length) {
        $('.froala').froalaEditor({
            toolbarButtons: [ 'bold', 'italic', 'underline', '|', 'color', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'insertTable', '|', 'insertHR', 'selectAll', 'clearFormatting',],
            quickInsertTags: [''],
            key: 'wcawA-9wpddD-17vnoG3qqqdnl=='
        });
    }
});

function getInstagramData() {
    if (instagram) {
        $.ajax({url: "https://api.instagram.com/v1/users/self/media/recent/?access_token=5810898585.3b52b49.86e493d9c7ef401cae4852b6d04cacda", success: function(result){
            displayInstagram(result.data);
        }});
    }
}

function displayInstagram(instagramData) {

    var i;
    for (i = 0; i < 6; i++) {
        var instagramLink = document.createElement('a');
        var instagramDiv = document.createElement('div');
        var instagramImg = document.createElement('img');
        instagramLink.setAttribute('target', '_blank');
        instagramDiv.className = "col-sm-6 col-md-4 col-lg-4";
        instagramLink.href = instagramData[i].link;
        instagramImg.src = instagramData[i].images.standard_resolution.url;
        instagramDiv.appendChild(instagramLink);
        instagramLink.appendChild(instagramImg);
        instagram.appendChild(instagramDiv);
    }

}

getInstagramData();

navScroll();
jobCapScroll();