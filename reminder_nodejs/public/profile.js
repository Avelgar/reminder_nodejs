const profilelogo = document.getElementById('profilelogo');
const profilelogocover = document.getElementById('profilelogocover');

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.scroll-up').onclick = scrollToTop;
});

function checkFields() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('loginEmail').value;
    const tgid = document.getElementById('TGid').value;

    // Скрыть предыдущие сообщения об ошибках
    document.getElementById('nameError').style.display = 'none';
    document.getElementById('emailError').style.display = 'none';
    document.getElementById('tgidError').style.display = 'none';

    let valid = true; // Переменная для отслеживания валидности

    if (!name) {
        document.getElementById('nameError').style.display = 'block';
        valid = false;
    }

    if (!email) {
        document.getElementById('emailError').style.display = 'block';
        valid = false;
    }

    if (!tgid) {
        document.getElementById('tgidError').style.display = 'block';
        valid = false;
    }

    if (valid) {
        window.location.href = 'user.html';
    }
}

profilelogo.addEventListener('mouseover', function() {
    profilelogocover.classList.remove('hidden');
    profilelogo.style.zIndex = "1";
    profilelogocover.style.zIndex = "2";
});

profilelogocover.addEventListener('mouseout', function() {
    profilelogocover.classList.add('hidden');
    profilelogo.style.zIndex = "2";
    profilelogocover.style.zIndex = "1";
});
        

    
