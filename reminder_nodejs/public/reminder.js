document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.scroll-up').onclick = scrollToTop;

    var signinModal = document.getElementById("Signin");
    var loginModal = document.getElementById("Login");
    var recoveryModal = document.getElementById("Recovery");
    var captchaModal = document.getElementById("Captcha");
    var openSigninBtns = document.getElementsByClassName("openSigninForm");
    var openLoginBtns = document.getElementsByClassName("openLoginForm");
    var openCaptchaLinks = document.getElementsByClassName("openCaptchaForm");
    var closeBtns = document.getElementsByClassName("close");
    var CaptchaImg = document.getElementById("CaptchaImg");
    const registerSuccessMessage = document.getElementById("registerSuccessMessage");
    const userExistsMessage = document.getElementById("userExistsMessage");
    const loginErrorMessage = document.getElementById("loginErrorMessage");
    const recoveryMessage = document.getElementById("recoveryMessage");
    const captchaErrorMessage = document.getElementById("captchaErrorMessage");
    

    Array.from(openSigninBtns).forEach(button => {
        button.onclick = function () {
            signinModal.style.display = "block";
        }
    });

    Array.from(openLoginBtns).forEach(button => {
        button.onclick = function () {
            loginModal.style.display = "block";
        }
    });

    Array.from(openCaptchaLinks).forEach(link => {
        link.onclick = function () {
            captchaModal.style.display = "block";
        }
    });

    Array.from(closeBtns).forEach(button => {
        button.onclick = function () {
            this.parentElement.parentElement.style.display = "none";
            captchaErrorMessage.style.display = "none";
        }
    });

    window.onclick = function (event) {
        if (event.target == signinModal || event.target == loginModal || event.target == recoveryModal || event.target == captchaModal) {
            event.target.style.display = "none";
            captchaErrorMessage.style.display = "none";
        }
    }

    document.getElementById("LoginForm").onsubmit = function (event) {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
    
        document.getElementById("loginErrorMessage").style.display = "none";
        document.getElementById("bannedMessage").style.display = "none";
        document.getElementById("nonExistentMessage").style.display = "none";
    
        fetch('/reminder.html/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {

                    if (text.includes('User not found')) {
                        document.getElementById("nonExistentMessage").style.display = "block";
                    } else if (text.includes('Invalid password')) {
                        document.getElementById("loginErrorMessage").style.display = "block";
                    } else if (text.includes('User is banned')) {
                        document.getElementById("bannedMessage").style.display = "block";
                    }
                    throw new Error('Login failed');    
                });
            }
            return response.text();
        })
        .then(message => {
            if (message === 'Admin login successful') {
                window.location.href = '/admin.html';
            } else if (message === 'Login successful') {
                window.location.href = '/user.html';
            }
        })
        .catch(error => {
            console.error(error);
        });
    };
    
    

    document.getElementById("SignInForm").onsubmit = function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("password2").value;
        const login = document.getElementById("login").value;
    
        document.getElementById("registerSuccessMessage").style.display = "none";
        document.getElementById("userExistsMessage").style.display = "none";
        document.getElementById("passwordMismatchMessage").style.display = "none";
        document.getElementById("loginExistsMessage").style.display = "none";
    
        if (password !== confirmPassword) {
            document.getElementById("passwordMismatchMessage").style.display = "block";
            return;
        }
        fetch('/reminder.html/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, login })
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    if (text.includes('User already exists')) {
                        document.getElementById("userExistsMessage").style.display = "block";
                    } 
                    else if (text.includes('Login exists')) {
                        document.getElementById("loginExistsMessage").style.display = "block";
                    }
                    throw new Error('Registration failed');
                });
            }
            return response.text();
        })
        .then(message=>{
            if (message === 'User registered successfully') {
                document.getElementById("registerSuccessMessage").style.display = "block";
            }
        }
        )
        .catch(error => {
            console.error(error);
        });
    };
    
    

    document.getElementById("RecoveryForm").onsubmit = function (event) {
        event.preventDefault();
        const email = document.getElementById("recoveryEmail").value;
        recoveryMessage.style.display = "block";
    };

    document.getElementById("CaptchaForm").onsubmit = function (event) {
        event.preventDefault();
        const captchaInput = document.getElementById("captchaInput").value;
        
        if ((captchaInput === "докежь") && (CaptchaImg.src.includes("capcha.jpg"))) {
            captchaModal.style.display = "none";
            recoveryModal.style.display = "block";
        } else if (CaptchaImg.src.includes("capcha.jpg")) {
            CaptchaImg.src = "capcha2.png";
            captchaErrorMessage.style.display = "block";
        } else if ((captchaInput === "hsmhn") && (CaptchaImg.src.includes("capcha2.png"))) {
            captchaModal.style.display = "none";
            recoveryModal.style.display = "block";
        } else if (CaptchaImg.src.includes("capcha2.png")){
            CaptchaImg.src = "capcha.jpg";
            captchaErrorMessage.style.display = "block";
        }
    };
});