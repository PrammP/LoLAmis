// URLs for fetching data and images
const apiUrl =
  "https://ddragon.leagueoflegends.com/cdn/14.17.1/data/fr_FR/runesReforged.json";
const imgBaseUrl = "https://ddragon.leagueoflegends.com/cdn/img/"; // Corrected base URL for images
const runeContainer = document.getElementById("runeContainer");

// Function to fetch and display all primary runes
function fetchAndDisplayRunes() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((runes) => {
      // Iterate over each rune tree
      runes.forEach((runeTree) => {
        // Primary runes are in the first slot of each tree
        const primaryRunes = runeTree.slots[0].runes;

        // Display each primary rune
        primaryRunes.forEach((rune) => {
          // Construct the full URL for the rune image
          const imgUrl = `${imgBaseUrl}${rune.icon}`; // Use the full path from the API data

          const img = document.createElement("img");
          img.src = imgUrl; // Use the correct image URL
          img.alt = rune.name; // Alternative text for the image
          img.style.margin = "10px"; // Optional: Add some margin for spacing

          // Error handling if the image fails to load
          img.onerror = () => {
            console.error(`Error loading image for rune: ${rune.name}`);
          };

          // Append the rune image to the container
          runeContainer.appendChild(img);
        });
      });
    })
    .catch((error) => {
      console.error("Error loading runes:", error);
    });
}

// Call the function to fetch and display runes
fetchAndDisplayRunes();
