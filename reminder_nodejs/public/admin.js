document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.scroll-up').onclick = scrollToTop;
    // const urlParams = new URLSearchParams(window.location.search);
    // const userId = urlParams.get('id');
    
    // if (userId) {
var closeBtns = document.getElementsByClassName("close");
var blockuserModal = document.getElementById("Blockuser");
var openBlockuserBtns = document.getElementsByClassName("openBlockuserForm");
const BlockSuccessMessage = document.getElementById("BlockSuccessMessage");
const BlockUserIsAdminMessage = document.getElementById("BlockUserIsAdminMessage");
const BlockNoUserMessage = document.getElementById("BlockNoUserMessage");

var addadminModal = document.getElementById("Addadmin");
var openAddadminBtns = document.getElementsByClassName("openAddadminForm");

const AddAdminSuccessMessage = document.getElementById("AddAdminSuccessMessage");
const AddAdminNoUserMessage = document.getElementById("AddAdminNoUserMessage");
const AddAdminIsBannedMessage = document.getElementById("AddAdminIsBannedMessage");

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

// const comments = document.getElementById("comments").value;

document.getElementById("BlockuserForm").onsubmit = function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;

    // Скрываем все сообщения перед отправкой
    BlockUserIsAdminMessage.style.display = "none";
    BlockSuccessMessage.style.display = "none";
    BlockNoUserMessage.style.display = "none";

    // Отправка запроса на сервер для блокировки пользователя
    fetch('/blockUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                if (text.includes('User is admin')) {
                    BlockSuccessMessage.style.display = "none";
                    BlockNoUserMessage.style.display = "none";
                    BlockUserIsAdminMessage.style.display = "block";
                } else if (text.includes('User not found')) {
                    BlockUserIsAdminMessage.style.display = "none";
                    BlockSuccessMessage.style.display = "none";
                    BlockNoUserMessage.style.display = "block";
                }
                throw new Error('Action failed');
            });
        }
        return response.json();
    })
    .then(data => {
        BlockUserIsAdminMessage.style.display = "none";
        BlockNoUserMessage.style.display = "none";
        BlockSuccessMessage.style.display = "block";
    })
    .catch(error => {
        console.error(error);
    }); 
};



document.getElementById("AddadminForm").onsubmit = function (event) {
    event.preventDefault();

    const email = document.getElementById("addadminemail").value;

    AddAdminSuccessMessage.style.dispay ="none";
    AddAdminNoUserMessage.style.dispay ="none";
    AddAdminIsBannedMessage.style.display = "none";

    fetch('/addAdmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                if (text.includes('User not found')) {
                    AddAdminIsBannedMessage.style.display = "none";
                    AddAdminSuccessMessage.style.display = "none";
                    AddAdminNoUserMessage.style.display = "block";
                } else if (text.includes('User is banned')) {
                    AddAdminSuccessMessage.style.display = "none";
                    AddAdminNoUserMessage.style.display = "none";
                    AddAdminIsBannedMessage.style.display = "block";
                }
                throw new Error('Action failed');
            });
        }
        return response.json();
    })
    .then(data => {
        AddAdminIsBannedMessage.style.display = "none";
        AddAdminNoUserMessage.style.display = "none";
        AddAdminSuccessMessage.style.display = "block";
    })
    .catch(error => {
        console.error(error);
    });
};
    // }
});