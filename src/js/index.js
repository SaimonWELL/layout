function isBackdropFilterSupported() {
    return CSS.supports('backdrop-filter', 'blur(5px)') || CSS.supports('-webkit-backdrop-filter', 'blur(5px)');
}
document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('DOMContentLoaded', function() {
        const elements = document.querySelectorAll('.backdrop-blur');
        if (!isBackdropFilterSupported()) {
            elements.forEach(function(element) {
                element.classList.remove('backdrop-blur');
                element.classList.add('no-backdrop-filter');
            });
        }
    });



    const signupButton = document.getElementById('signup-button');
    const popup = document.getElementById('popup');
    const closeButton = document.getElementById('close-button');
    const signupForm = document.getElementById('signup-form');
    const thankYou = document.getElementById('thank-you');
    const body = document.getElementsByTagName('body');

    signupButton.addEventListener('click', () => {
        popup.classList.remove('hidden');
        body[0].style.overflow ='hidden';
    });

    closeButton.addEventListener('click', () => {
        popup.classList.add('hidden');
        body[0].style.overflow ='visible';
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            popup.classList.add('hidden');
            body[0].style.overflow ='visible';
        }
    });

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Валидация
        let isValid = true;
        if (!validateEmail(email)) {

            showError('email', 'Please enter a valid e-mail');
            isValid = false;
        } else {
            clearError('email');
        }

        if (password.length < 8) {
            showError('password', 'Password must be at least 8 characters');
            isValid = false;
        } else {
            clearError('password');
        }

        if (!isValid) {
            return;
        }

        signupForm.classList.add('hidden');
        thankYou.classList.remove('hidden')

        // Попытка авторизации
        const authResponse = await fetch('https://api.dating.com/identity', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(`${email}:${password}`)
            }
        });

        if (authResponse.ok) {
            const token = authResponse.headers.get('X-Token');
            redirectToAuthorizedZone(token);
            return;
        }

        // Регистрация
        const response = await fetch('https://api.dating.com/identity', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const token = response.headers.get('X-Token');
            thankYou.classList.remove('hidden');
            signupForm.classList.add('hidden');
            setTimeout(() => {
                redirectToAuthorizedZone(token);
            }, 2000);
        } else {
            showError('form', 'Registration failed');
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return re.test(email);
    }

    function showError(field, message) {
        const errorElement = document.getElementById(`${field}-error`);
        const inputElement = document.getElementById(field);

        const errorIcon = document.getElementById(`${field}-error-icon`);
        if (errorElement && inputElement && errorIcon) {
            errorElement.textContent = message;
            inputElement.classList.add('error');

            inputElement.parentElement.classList.add('error');
            errorIcon.style.visibility = 'visible';
        }
    }

    function clearError(field) {
        const errorElement = document.getElementById(`${field}-error`);
        const inputElement = document.getElementById(field);
        const errorIcon = document.getElementById(`${field}-error-icon`);
        if (errorElement && inputElement && errorIcon) {
            errorElement.textContent = '';
            inputElement.classList.remove('error');
            inputElement.parentElement.classList.remove('error');
            errorIcon.style.visibility = 'hidden';
        }
    }

    function redirectToAuthorizedZone(token) {
        if (token) {
            localStorage.setItem('authToken', token);
            window.location.href = `https://www.dating.com/people/#token=${token}`;
        }
    }

    window.addEventListener('load', () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            redirectToAuthorizedZone(token);
        }
    });
});
