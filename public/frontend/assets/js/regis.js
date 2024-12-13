document.getElementById('user-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
  
    // Collect form data
    const formData = new FormData(event.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');
  
    // Validate form data
    if (password !== confirmPassword) {
      alert("Confirm Password must be the same as Password");
      return;
    }
  
    const userData = {
      "name": formData.get('username'),
      "email": formData.get('email'),
      "mobileno": parseInt(formData.get('mob')), // Correct key: 'mobileno'
      "address": formData.get('address'),
      "password": password
    };
    
    // Additional validation: Ensure mobile number is numeric
    if (isNaN(userData.mobileno)) { // Correct key: 'mobileno'
      alert("Mobile number must be numeric");
      return;
    }
    
  
    // Additional validation: Ensure email format is correct
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(userData.email)) {
      alert("Invalid email format");
      return;
    }
  
    try {
      const response = await fetch('/adduser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("auth-token",data.token)
        alert('User added successfully!');
        console.log(data);
        // Optionally, reset the form
        event.target.reset();
      } else {
        const errorData = await response.json();
        alert(`Failed to add user: ${errorData.message}`);
        console.log(`Failed to add user: ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the user.');
    }
  });
  