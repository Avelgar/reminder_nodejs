document.addEventListener('DOMContentLoaded', function () {
    loadProfileData();
    document.querySelector('.scroll-up').onclick = scrollToTop;
});

function loadProfileData() {
    fetch('/profile') 
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('login').innerText = data.login;
        document.getElementById('Email').innerText = data.email;
        document.getElementById('telegram_id').value = data.telegram_id || '';
    })
    .catch(error => console.error('Error loading profile data:', error));
}


function checkFields() {
    const telegram_id = document.getElementById('telegram_id').value;

    document.getElementById('telegram_idError').style.display = 'none';

    let valid = true;

    if (!telegram_id) {
        document.getElementById('telegram_idError').style.display = 'block';
        valid = false;
    }

    if (valid) {
        fetch('/updateTelegramId', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ telegram_id: telegram_id })
        })
        .then(response => {
            if (response.ok) {
                window.location.href = 'user.html';
            } else {
                console.error('Error updating Telegram ID');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}
