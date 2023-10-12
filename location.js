// Get the searchQuery from the URL
const urlSearchParams = new URLSearchParams(window.location.search);
const searchQuery = urlSearchParams.get('searchQuery');

if (searchQuery) {
    // You now have the searchQuery value, and you can use it as needed
    console.log('Search Query from URL:', decodeURIComponent(searchQuery));


    // fetch longitude and latitude from opencage api
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${searchQuery}&key=63d7b18fa872497c81e91fc51330bf49`)
        .then(response => response.json())
        .then(data => {
            var lat = data.results[0].geometry.lat;
            var lon = data.results[0].geometry.lng;
            console.log(data.results[0].geometry.lat);
            console.log(data.results[0].geometry.lng);

            // Now that you have lat and lon, make the second request
            const apiKey = 'a0a1fc35382041d3bb2c48bf6f71a2f1';
            const radius = 5000;

            fetch(`https://api.geoapify.com/v2/places?categories=tourism.attraction&bias=proximity:${lon},${lat}&limit=20&apiKey=a0a1fc35382041d3bb2c48bf6f71a2f1`)
                .then(response => response.json())
                .then(data => {
                    {
                        //console.log(data)
                        const attractionsGrid = document.getElementById('attractions-grid');

                        attractionsGrid.innerHTML = '';

                        data.features.forEach(feature => {
                            const attractionContainer = document.createElement('div');
                            attractionContainer.classList.add('attraction-container');

                            // Set up the API endpoint
                            const apiUrl = `https://api.unsplash.com/search/photos?query=${feature.properties.name}&client_id=wlJ63mDCuBrFmQvSIkvc_cpFGIxy00xr_tLM67j0sFo`;

                            // Make a GET request to the Unsplash API
                            fetch(apiUrl)
                                .then(response => response.json())
                                .then(data => {
                                    // Handle the data received from the API
                                    console.log(data);
                                    // The images can be accessed in data.results
                                    const imgsrc = data.results[0].urls.small;
                                


                            // Create an <img> element for the image
                            const attractionImage = document.createElement('img');
                            attractionImage.src = imgsrc ; // Replace with the URL of your image
                            attractionImage.classList.add('attraction-image');
                            attractionContainer.appendChild(attractionImage);

                            // Create a <div> for attraction details
                            const attraction = document.createElement('div');
                            attraction.classList.add('attraction');

                            attraction.innerHTML = `
                              <h2>${feature.properties.name}</h2>
                              <p>${feature.properties.formatted}</p>
                            `;

                            attractionContainer.appendChild(attraction);
                            attractionsGrid.appendChild(attractionContainer);

                        })
                        .catch(error => {
                            console.error('Error fetching data from Unsplash:', error);
                        });


                        });
                    }

                })
                .catch(error => {
                    console.error('Error fetching data from Geoapify API:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching data from OpenCageData API:', error);
        });



} else {
    console.error('Search Query not found in URL.');
}