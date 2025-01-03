// Fetch userId from local storage
const userId = localStorage.getItem('auth-token');

// Redirect if userId does not exist
if (!userId) {
  window.location = "../../Register.html";
}

// Form Submit Logic
document.getElementById('property-form').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent default form submission

  const form = event.target;
  const formData = new FormData(form);

  // Append user ID to FormData
  formData.append('userId', userId);

  // Convert 'features' field from a comma-separated string to individual entries
  const features = formData.get('features');
  if (features) {
    formData.delete('features');
    features.split(',').map(feature => feature.trim()).forEach(feature => {
      formData.append('features[]', feature);
    });
  }

  // Append files to FormData
  const images = document.getElementById('images').files;
  for (const file of images) {
    formData.append('images[]', file);
  }

  try {
    // Send form data to the server
    const response = await fetch('/properties', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      alert('Property submitted successfully!');
      console.log('Response:', data);
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData);
      alert(`Failed to submit property: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while submitting the property.');
  }
});
