let usermob=""
async function fetchPropertyData() {
    try {
      // Extract 'userid' from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('propid');
  
      if (!userId) {
        console.error('UserID not found in the URL');
        return;
      }
  
      // Define the API endpoint
      const apiUrl = `http://localhost:3000/properties/${userId}`;
      
      // Make a POST request to fetch property data
      const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
            },
        });
        
        // Handle the API response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Property data:', data);
        const usrUrl = `http://localhost:3000/getname/${data.userId}`;
        document.title=data.address
        // Make a POST request to fetch property data
      const myres = await fetch(usrUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
          },
      });
      
      // Handle the API response
      if (!myres.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const usrname = await myres.json();
      console.log(usrname)
      document.getElementById("usr").innerText=usrname.name
      document.getElementById("prop-title").innerText=data.address
      document.getElementById("area").innerText=data.area
      document.getElementById("bedroom").innerText=data.bedrooms
      document.getElementById("baths").innerText=data.baths
      document.getElementById("cost").innerText=data.price
      document.getElementById("lets-mail").setAttribute("href",`mailto:${usrname.mailid}`)
      usermob=usrname.mobile
      // You can now use the fetched data as needed
    } catch (error) {
      console.error('Error fetching property data:', error.message);
    }
  }
  
  // Call the function to fetch data
  fetchPropertyData();
  document.getElementById("buy-prop").addEventListener("click",()=>{
    window.location.href=`tel:${usermob}`
  })