const userId = localStorage.getItem('auth-token');

if (!userId) {
  window.location = "../../Register.html";
}

document.getElementById('property-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const features = formData.get('features');
  if (features) {
    formData.delete('features');
    features.split(',').map((feature) => feature.trim()).forEach((feature) => {
      formData.append('features[]', feature);
    });
  }

  try {
    const response = await fetch('/properties', {
      method: 'POST',
      headers: { token: userId },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      alert('Property submitted successfully!');
      window.location = `./listing.html`;
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
