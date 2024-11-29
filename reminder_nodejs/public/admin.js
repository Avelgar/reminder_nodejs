document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.scroll-up').onclick = scrollToTop;
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    
    if (userId) {
var closeBtns = document.getElementsByClassName("close");
var blockuserModal = document.getElementById("Blockuser");
var openBlockuserBtns = document.getElementsByClassName("openBlockuserForm");
const registerSuccessMessage = document.getElementById("registerSuccessMessage");
const registerErrorMessage = document.getElementById("registerErrorMessage");

var addadminModal = document.getElementById("Addadmin");
var openAddadminBtns = document.getElementsByClassName("openAddadminForm");
const registerSuccessMessage2 = document.getElementById("registerSuccessMessage2");
const registerSuccessMessage3 = document.getElementById("registerSuccessMessage3");

Array.from(closeBtns).forEach(button => {
    button.onclick = function () {
        this.parentElement.parentElement.style.display = "none";

        if (typeof captchaErrorMessage !== 'undefined') {
            captchaErrorMessage.style.display = "none";
        }
    }
});

Array.from(openBlockuserBtns).forEach(button => {
    button.onclick = function () {
        blockuserModal.style.display = "block";
    }
});

Array.from(openAddadminBtns).forEach(button => {
    button.onclick = function () {
        addadminModal.style.display = "block";
    }
});

window.onclick = function (event) {
    if (event.target == blockuserModal || event.target == addadminModal) {
        event.target.style.display = "none";
    }
}

document.getElementById("BlockuserForm").onsubmit = function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const comments = document.getElementById("comments").value;
    if (email == "admin@gmail.com") {
        registerErrorMessage.style.display = "block";
        registerSuccessMessage.style.display = "none";
    } else {
        registerSuccessMessage.style.display = "block";
        registerErrorMessage.style.display = "none";
    }
};

document.getElementById("AddadminForm").onsubmit = function (event) {
    event.preventDefault();
    const email = document.getElementById("addadminemail").value;
    if (email == "admin@gmail.com") {
        registerErrorMessage2.style.display = "block";
        registerErrorMessage3.style.display = "none";
        registerSuccessMessage2.style.display = "none";
    } else if (email == "ggadmin@gmail.com") {
        registerErrorMessage3.style.display = "block";
        registerErrorMessage2.style.display = "none";
        registerSuccessMessage2.style.display = "none";
    } else {
        registerSuccessMessage2.style.display = "block";
        registerErrorMessage2.style.display = "none";
        registerErrorMessage3.style.display = "none";
    }
};
    }
});