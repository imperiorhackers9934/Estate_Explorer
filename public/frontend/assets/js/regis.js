document.getElementById('user-form').addEventListener('submit', async function (event) {
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

  // Additional validation: Ensure mobile number is numeric
  const mobileNumber = formData.get('mob');
  if (!mobileNumber || isNaN(mobileNumber) || !/^[6-9]\d{9}$/.test(mobileNumber)) {
    alert("Invalid mobile number");
    return;
  }

  // Replace 'mob' with 'mobileno'
  formData.delete('mob');
  formData.append('mobileno', mobileNumber);

  try {
    const response = await fetch('/adduser', {
      method: 'POST',
      body: formData, // FormData is directly passed without specifying Content-Type
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("auth-token", data.token);
      alert('User added successfully!');
      console.log(data);
      event.target.reset(); // Reset the form
      window.location = "dashboard.html"; // Redirect to dashboard
    } else {
      const errorData = await response.json();
      alert(`Failed to add user: ${errorData.msg}`);
      console.log(`Failed to add user:`, errorData);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while adding the user.');
  }
});
