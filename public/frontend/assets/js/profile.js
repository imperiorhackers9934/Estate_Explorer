document.addEventListener('DOMContentLoaded', function () {
  const user = localStorage.getItem('auth-token');
  const usrUrl = `http://localhost:3000/getuser/${user}`;

  // Make a GET request to fetch user data
  async function fetchUserData() {
    const myres = await fetch(usrUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle the API response
    if (!myres.ok) {
      throw new Error(`HTTP error! status: ${myres.status}`);
    }

    const usrname = await myres.json();
    console.log(usrname);
    document.title = usrname.name;
    document.getElementById('userimage').setAttribute('src', `./profile/${usrname.image}`);
    document.getElementById('name').setAttribute('value', usrname.name);
    document.getElementById('email').setAttribute('value', usrname.mailid);
    document.getElementById('mobile').setAttribute('value', usrname.mobileno);
  }
  fetchUserData();

  // Handle form submission for user update
  document.getElementById('profile-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const password = formData.get('password');

    try {
      const response = await fetch(`/updateuser/${user}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert('User Updated successfully!');
        window.location = './dashboard.html';
        console.log('Response:', data);
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert(`Failed to update user: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating user details.');
    }
  });

  // Handle user deletion
  document.getElementById('delacc').addEventListener('click', async function (event) {
    event.preventDefault();
    if (!confirm('Are you sure you want to delete your account?')) {
      return;
    }

    try {
      const response = await fetch(`/deleteuser/${user}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.removeItem('auth-token');
        alert('User Deleted successfully!');
        window.location = './index.html';
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert(`Failed to delete user: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting user.');
    }
  });

});