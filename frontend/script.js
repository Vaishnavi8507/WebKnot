const signinButton = document.getElementById('signin-button');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const loginFormContainer = document.getElementById('login-form-container');
const signupFormContainer = document.getElementById('signup-form-container');
const showSignupForm = document.getElementById('show-signup-form');
const showLoginForm = document.getElementById('show-login-form');

// Open the modal when "Sign In" button is clicked
signinButton.addEventListener('click', () => {
    modal.style.display = 'flex'; // Show modal
    loginFormContainer.style.display = 'block'; // Show login form by default
    signupFormContainer.style.display = 'none'; // Hide signup form initially
});

// Close the modal when "X" button is clicked
closeModal.addEventListener('click', () => {
    modal.style.display = 'none'; // Hide modal
});

// Close the modal when clicking outside the modal content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none'; // Hide modal
    }
});

// Switch to Sign Up form
showSignupForm.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent link behavior
    loginFormContainer.style.display = 'none';
    signupFormContainer.style.display = 'block';
});

// Switch back to Login form
showLoginForm.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent link behavior
    signupFormContainer.style.display = 'none';
    loginFormContainer.style.display = 'block';
});

// Handle login
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', data.token); // Save the token
            window.location.href = '/dashboard'; // Navigate to the dashboard
        } else {
            alert(data.message); // Display error message if login fails
        }
    } catch (error) {
        alert('Error during login: ' + error.message); // Handle fetch errors
    }
});


// Handle registration
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Check if passwords match
    if (data['signup-password'] !== data['signup-confirm-password']) {
        alert("Passwords don't match.");
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: data['signup-name'],
                email: data['signup-email'],
                password: data['signup-password'],
            }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Registration successful! Please log in.');
            // Switch to login form after successful registration
            loginFormContainer.style.display = 'block';
            signupFormContainer.style.display = 'none';
        } else {
            alert(result.message); // Show error message
        }
    } catch (error) {
        alert('Error during registration: ' + error.message); // Catch any network errors
    }
});
