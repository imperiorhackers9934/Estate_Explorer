'use strict';



/**
 * add event on element
 */

const addEventOnElement = function (element, type, listener) {
  // Check if element is a collection (NodeList, HTMLCollection, or Array)
  if (NodeList.prototype.isPrototypeOf(element) || HTMLCollection.prototype.isPrototypeOf(element) || Array.isArray(element)) {
    for (let i = 0; i < element.length; i++) {
      element[i].addEventListener(type, listener);
    }
  } else if (element && typeof element.addEventListener === 'function') {
    // Handle single DOM element
    element.addEventListener(type, listener);
  } else {
    console.error('Invalid element:', element);
  }
};


/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const navToggler = document.querySelector("[data-nav-toggler]");

const toggleNav = function () {
  navbar.classList.toggle("active");
  this.classList.toggle("active");
}

addEventOnElement(navToggler, "click", toggleNav);


const closeNav = function () {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
}

addEventOnElement(navLinks, "click", closeNav);



/**
 * add active class on header & back to top button
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * hero tab button
 */

const tabBtns = document.querySelectorAll("[data-tab-btn]");

let lastClickedTabBtn = tabBtns[0];

const changeTab = function () {
  lastClickedTabBtn.classList.remove("active");
  this.classList.add("active");
  lastClickedTabBtn = this;
}
  // <div>
  //         // <h2>${property.address}</h2>
  //         // <p>Price: ₹${property.price}</p>
  //         // <p>Rating: ${property.rating} stars</p>
  //         // <p>Area: ${property.area} sqft</p>
  //         // <p>Bedrooms: ${property.bedrooms}</p>
  //         // <p>Baths: ${property.baths}</p>
  //         <p>Added by user ID: ${property.userId}</p>
  //         <p>Date Added: ${new Date(property.dateAdded).toLocaleDateString()}</p>
  //       </div>
  //       <hr></hr>
addEventOnElement(tabBtns, "click", changeTab);

$(document).ready(function() {
  // Define the URL to fetch properties from
  const apiUrl = 'http://localhost:3000/properties';

  // Fetch properties from the server
  $.get(apiUrl, function(data) {
    // Get the container where properties will be displayed
    const propertyList = $('.property-list');
    console.log(data)
    // Iterate through the properties and create HTML elements for each one
    data.forEach(function(property) {
      let stars = ''; for (let i = 0; i < parseInt(property.rating); i++) { stars += '<ion-icon name="star"></ion-icon>'; }
      const propertyItem = `
          <li>
              <div class="property-card">

                <figure class="card-banner img-holder" style="--width: 800; --height: 533;">
                  <img src=${property.images.length!=0 ?"/uploads/"+property.images[0] :"./assets/images/property-1.jpg"} width="800" height="533" loading="lazy"
                    alt="10765 Hillshire Ave, Baton Rouge, LA 70810, USA" class="img-cover">
                </figure>

                <button class="card-action-btn" aria-label="add to favourite">
                  <ion-icon name="heart" aria-hidden="true"></ion-icon>
                </button>

                <div class="card-content">

                  <h3 class="h3">
                    <a href="./view.html?propid=${property._id}" class="card-title">${property.title+"<b> at </b>"+property.address}</a>
                  </h3>

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
            </li>

      `;
      propertyList.append(propertyItem);
    });
  });
});
