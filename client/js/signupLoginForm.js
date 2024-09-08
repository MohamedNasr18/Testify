// Handle input focus and blur events to add/remove "focus" class
const inputs = document.querySelectorAll(".input");

function addcl() {
  let parent = this.parentNode.parentNode;
  parent.classList.add("focus");
}

function remcl() {
  let parent = this.parentNode.parentNode;
  if (this.value === "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", addcl);
  input.addEventListener("blur", remcl);
});

// Display feedback messages
function displayFeedback(message, type, formType) {
  const feedbackElement =
    formType === "signup"
      ? document.getElementById("signupFeedback")
      : document.getElementById("loginFeedback");

  feedbackElement.className = `feedback-message ${type}`;
  feedbackElement.textContent = message;
  feedbackElement.style.display = "block";

  // Automatically hide the feedback message after 6 seconds
  setTimeout(() => {
    feedbackElement.style.display = "none";
  }, 6000);
}

// Toggle between forms with animation
function showLoginForm() {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  // Ensure the forms are in their default state before applying new classes
  signupForm.classList.remove("slide-in-left", "slide-out-left");
  loginForm.classList.remove("slide-in-right", "slide-out-right", "active");

  signupForm.classList.add("slide-out-left");
  loginForm.classList.add("slide-in-right", "active");
}

function showSignupForm() {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  // Ensure the forms are in their default state before applying new classes
  loginForm.classList.remove("slide-in-right", "slide-out-right");
  signupForm.classList.remove("slide-in-left", "slide-out-left", "active");

  loginForm.classList.add("slide-out-right");
  signupForm.classList.add("slide-in-left", "active");
}

// Handle form submission for Signup
document.getElementById('signupForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Validate signup form
  if (!validateSignup()) {
    return; // Stop form submission if validation fails
  }

  // Get the form data
  const formData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  try {
    // Send the form data to the server using fetch
    const response = await fetch('http://localhost:3001/api/students/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    // Display the response message
    displayFeedback(result.message || 'Registration successful!', 'success', 'signup');

    // Optionally, you can redirect the user or clear the form after success
    if (response.ok) {
      // Use 'fullName' to match with retrieval
      document.getElementById('signupForm').reset();
      showLoginForm();
    }
  } catch (error) {
    displayFeedback('An error occurred. Please try again.', 'error', 'signup');
    console.error('Error:', error);
  }
});


// Handle form submission for Login
document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Validate login form
  if (!validateLogin()) {
    return; // Stop form submission if validation fails
  }

  // Get form data
  const formData = {
    email: document.getElementById('loginEmail').value,
    password: document.getElementById('loginPassword').value
  };

  try {
    // Send POST request to the server
    const loginResponse = await fetch('http://localhost:3001/api/students/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await loginResponse.json();

    // Check if the login is successful
    if (loginResponse.ok && result.token) {
      // Store the token and user details
      localStorage.setItem('token', result.token);  // Storing token
      localStorage.setItem('fullName', `${result.firstName} ${result.lastName}`);
      
      // Display success feedback
      displayFeedback('Login successful!', 'success', 'login');

      // Redirect to the exam page after successful login
      setTimeout(() => {
        window.location.href = "../welcome/welcome.html"; // Redirect to exam page
      }, 1500);
    } else {
      // Handle failed login with appropriate feedback
      displayFeedback(`Login failed: ${result.message}`, 'error', 'login');
    }
  } catch (error) {
    // Handle fetch request errors
    displayFeedback(`An error occurred: ${error.message}`, 'error', 'login');
    console.error('Fetch error:', error);
  }
});

// Define the validateSignup function
function validateSignup() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Simple validation rules
  if (!firstName || !lastName || !email || !password) {
    displayFeedback('Please fill out all fields.', 'error', 'signup');
    return false;
  }

  // Email format validation to ensure it ends with .com
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailEndsWithCom = /\.com$/i;
  if (!emailPattern.test(email) || !emailEndsWithCom.test(email)) {
    displayFeedback('Please enter a valid email address ending with .com.', 'error', 'signup');
    return false;
  }

  // Stronger password validation
  const passwordPattern = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
  if (!passwordPattern.test(password)) {
    displayFeedback(
      'Password must be at least 8 characters long, include at least one uppercase letter, and one special character.',
      'error',
      'signup'
    );
    return false;
  }

  return true;
}

// Define the validateLogin function
function validateLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (email === '' || password === '') {
    displayFeedback('Please fill out all fields.', 'error', 'login');
    return false;
  }

  return true;
}
