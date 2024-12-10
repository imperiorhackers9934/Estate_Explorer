document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('mysearch').addEventListener('submit', async function(event) {
      event.preventDefault(); // Prevent default form submission
    
      // Collect form data
      const searchQuery = document.getElementById('search').value;
      const category = document.getElementById('category').value;
      const minPrice = document.getElementById('min-price').value;
      let maxPrice = document.getElementById('max-price').value;
      if (maxPrice == 0) {
        maxPrice = Number.MAX_VALUE;
      }
    console.log(searchQuery)
    console.log(category)
    console.log(minPrice)
    console.log(maxPrice)
      // Construct the query string
      const queryString = `search=${searchQuery}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    
      try {
        const response = await fetch(`/search-properties?${queryString}`, {
          method: 'GET'
        });
    console.log(queryString)
        if (response.ok) {
          const properties = await response.json();
          displayProperties(properties);
        } else {
          throw new Error('Failed to fetch properties');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching the properties.');
      }
    });
  
    function displayProperties(properties) {
      const propertyList = document.getElementById('property-list');
      propertyList.innerHTML = ''; // Clear previous results
  
      properties.forEach(property => {
        let stars = '';
        for (let i = 0; i < parseInt(property.rating); i++) {
          stars += '<ion-icon name="star"></ion-icon>';
        }
  
        const propertyItem = `
          <div class="property-card">
            <figure class="card-banner img-holder" style="--width: 800; --height: 533;">
              <img src="./assets/images/property-1.jpg" width="800" height="533" loading="lazy"
                alt="Property Image" class="img-cover">
            </figure>
            <button class="card-action-btn" aria-label="add to favourite">
              <ion-icon name="heart" aria-hidden="true"></ion-icon>
            </button>
            <div class="card-content">
              <h3 class="h3">
                <a href="#" class="card-title">${property.title}</a>
              </h3>
              <p>${property.location}</p>
              <ul class="card-list">
                <li class="card-item">
                  <div class="item-icon">
                    <ion-icon name="cube-outline"></ion-icon>
                  </div>
                  <span class="item-text">${property.area} sqf</span>
                </li>
                <li class="card-item">
                  <div class="item-icon">
                    <ion-icon name="bed-outline"></ion-icon>
                  </div>
                  <span class="item-text">${property.bedrooms} Beds</span>
                </li>
                <li class="card-item">
                  <div class="item-icon">
                    <ion-icon name="man-outline"></ion-icon>
                  </div>
                  <span class="item-text">${property.baths} Baths</span>
                </li>
              </ul>
              <div class="card-meta">
                <div>
                  <span class="meta-title">Price</span>
                  <span class="meta-text">₹${property.price}</span>
                </div>
                <div>
                  <span class="meta-title">Rating</span>
                  <span class="meta-text">
                    <div class="rating-wrapper">
                      ${stars}
                    </div>
                    <span>${property.rating}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        `;
        propertyList.insertAdjacentHTML('beforeend', propertyItem);
      });
    }
  });
  