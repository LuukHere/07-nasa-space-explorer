// Find our date picker inputs and button on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const getImagesBtn = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// Your NASA API key
const apiKey = 'fH0gQlXzcluVyPNwQpi46Yf8h10cLFZ8v3JU8sEs';

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Listen for button click to fetch images
getImagesBtn.addEventListener('click', () => {
  // Get the selected start and end dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // If either date is missing, show an alert and stop
  if (!startDate || !endDate) {
    alert('Please select both a start and end date.');
    return;
  }

  // Build the API URL with the selected date range
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  // Show a loading message
  gallery.innerHTML = '<p>Loading images...</p>';

  // Fetch images from NASA's API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Clear the gallery
      gallery.innerHTML = '';

      // If we get a single object, wrap it in an array for consistency
      const images = Array.isArray(data) ? data : [data];

      // Filter out non-image results
      const imageResults = images.filter(item => item.media_type === 'image');

      // If there are no images, show a message
      if (imageResults.length === 0) {
        gallery.innerHTML = '<p>No images found for this date range.</p>';
        return;
      }

      // This function shows a simple modal with the photo explanation
      function showModal(title, explanation) {
        // Create a background overlay
        const modalBg = document.createElement('div');
        modalBg.className = 'modal-bg'; // Use CSS class for styling

        // Create the modal box
        const modalBox = document.createElement('div');
        modalBox.className = 'modal-box'; // Use CSS class for styling

        // Add the title
        const modalTitle = document.createElement('h2');
        modalTitle.textContent = title;
        modalBox.appendChild(modalTitle);

        // Add the explanation text
        const modalText = document.createElement('p');
        modalText.textContent = explanation;
        modalBox.appendChild(modalText);

        // Add a close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.addEventListener('click', () => {
          document.body.removeChild(modalBg);
        });
        modalBox.appendChild(closeBtn);

        // Close modal when clicking outside the box
        modalBg.addEventListener('click', (event) => {
          if (event.target === modalBg) {
            document.body.removeChild(modalBg);
          }
        });

        modalBg.appendChild(modalBox);
        document.body.appendChild(modalBg);
      }

      // For each image, create a card and add it to the gallery
      imageResults.forEach(item => {
        // Create a div for the card
        const card = document.createElement('div');
        card.className = 'gallery-item';

        // Create an image element
        const img = document.createElement('img');
        img.src = item.url;
        img.alt = item.title;

        // Create a title element
        const title = document.createElement('h3');
        title.textContent = item.title;

        // Create a date element
        const date = document.createElement('p');
        date.textContent = `Date: ${item.date}`;

        // Add all elements to the card
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(date);

        // When the card is clicked, show the explanation in a modal
        card.addEventListener('click', () => {
          showModal(item.title, item.explanation);
        });

        // Add the card to the gallery
        gallery.appendChild(card);
      });
    })
    .catch(error => {
      // Show an error message if something goes wrong
      gallery.innerHTML = '<p>Error fetching images. Please try again later.</p>';
      console.error('Error fetching data:', error);
    });
});
