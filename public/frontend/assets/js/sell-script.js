// Fetch userId from local storage
const userId = localStorage.getItem('auth-token');
  
// Check if userId exists in local storage
if (!userId) {
  window.location="../../Register.html"
}
// Form Submit Logic
document.getElementById('property-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
  
    const form = event.target;
    const formData = new FormData(form);
    // Check if userId exists in local storage
    if (userId) {
      formData.append('userId', userId);
    } else {
      alert('User ID not found in local storage.');
      return;
    }
  
    // Convert features from comma-separated string to an array
    const features = formData.get('features').split(',').map(feature => feature.trim());
    formData.set('features', JSON.stringify(features)); // Store as JSON string in formData
  
    try {
      const response = await fetch('/submit-property', {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        const data = await response.json();
        alert('Property submitted successfully!');
        console.log(data);
      } else {
        throw new Error('Failed to submit property');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the property.');
    }
  });
  