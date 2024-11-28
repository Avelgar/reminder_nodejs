function toggleTheme() {
    const button = document.getElementById('themeToggle');
    const body = document.body;
    const logo = document.getElementById('headerLogo');

    if (button.classList.contains('sun')) {
        button.classList.remove('sun');
        button.classList.add('moon');
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        logo.src = 'logo_darktheme.png';
    } else {
        button.classList.remove('moon');
        button.classList.add('sun');
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        logo.src = 'logo.png';
    }

    updateBackground(body);
}


function updateBackground(body) {
    if (body.classList.contains('dark-theme')) {
        body.style.backgroundImage = "url('https://s1.1zoom.ru/big0/596/Evening_Forests_Mountains_Firewatch_Campo_Santo_549147_1280x720.jpg')";
    } else {
        body.style.backgroundImage = "url('https://cdn1.ozone.ru/s3/multimedia-8/6273738572.jpg')";
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const button = document.getElementById('themeToggle');
    const body = document.body;
    const logo = document.getElementById('headerLogo');

    if (savedTheme === 'dark') {
        button.classList.add('moon');
        body.classList.add('dark-theme');
        logo.src = 'logo_darktheme.png';
    } else {
        button.classList.add('sun');
        body.classList.remove('dark-theme');
        logo.src = 'logo.png';
    }
    updateBackground(body);
}

document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});

