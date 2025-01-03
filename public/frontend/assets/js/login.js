document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginform');
  
    // Event listener for form submission
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the default form submission
  
      // Capture form inputs
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
        // Send login request to the server
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        // Parse the response
        const data = await response.json();
  
        if (response.ok) {
          // Login successful
          alert('Login successful!');
  
          // Store the auth token in localStorage
          localStorage.setItem('auth-token', data.token);
  
          // Redirect to a protected page or home page
          window.location.href = 'dashboard.html';
        } else {
          // Login failed
          alert(data.msg || 'Login failed. Please try again.');
        }
      } catch (error) {
        // Handle network or other errors
        console.error('Error:', error);
        alert('An error occurred while logging in. Please try again later.');
      }
    });
  });
  