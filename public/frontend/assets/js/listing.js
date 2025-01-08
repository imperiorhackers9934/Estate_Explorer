const user = localStorage.getItem('auth-token');
function parseDate(isoString) {
    const date = new Date(isoString);
  
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    return `<p class="date-added">Date Added -: ${hours}:${minutes} &ensp; ${day}/${month}/${year}</p>`;
  }
  
document.addEventListener('DOMContentLoaded', async function () {
    const propertyList = document.getElementById('property-list');

    // Fetch properties from the API
    async function fetchProperties(id) {
        try {
            const response = await fetch(`/userproperties/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }
            const properties = await response.json();
            console.log(properties)
            displayProperties(properties);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching the properties.');
            localStorage.removeItem('auth-token');
            window.location.href = '/login.html';
        }
    }

    // Display properties
    function displayProperties(properties) {
        propertyList.innerHTML = '';
        properties.forEach(property => {
            const propertyItem = document.createElement('div');
            propertyItem.classList.add('property-item');

            propertyItem.innerHTML = `
                        <h2>${property.title+" at "+property.address}</h2>
                        <p>${parseDate(property.dateAdded)}</p>
                        <a href="view.html?propid=${property._id}" class="view-btn">View Details</a>
                        <button class="delete-btn" data-id="${property._id}">Delete</button>
                    `;

            propertyItem.querySelector('.delete-btn').addEventListener('click', function () {
                if(window.confirm('Are you sure you want to delete this property?')){
                    deleteProperty(property._id);
                }
            });

            propertyList.appendChild(propertyItem);
        });
    }

    // Delete property
    async function deleteProperty(id) {
        try {
            const response = await fetch(`/properties/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'token': user,
                  },
            });
            if (!response.ok) {
                throw new Error('Failed to delete property');
            }
            alert('Property deleted successfully');
            fetchProperties(user);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting the property.');
        }
    }

    // Fetch properties on page load
    fetchProperties(user);
});
