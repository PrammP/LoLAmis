const apiUrl =
  "https://ddragon.leagueoflegends.com/cdn/14.17.1/data/fr_FR/runesReforged.json";
const imgBaseUrl = "https://ddragon.leagueoflegends.com/cdn/img/";
const runeContainer = document.getElementById("runeContainer");
const runeTypeSelector = document.getElementById("runeTypeSelector");

function fetchAndDisplayRunes(selectedType = "") {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((runes) => {
      runeContainer.innerHTML = "";

      runes.forEach((runeTree) => {
        if (!selectedType || runeTree.key === selectedType) {
          const primaryRunes = runeTree.slots[0].runes;

          primaryRunes.forEach((rune) => {
            const imgUrl = `${imgBaseUrl}${rune.icon}`;

            const img = document.createElement("img");
            img.src = imgUrl;
            img.alt = rune.name;
            img.style.margin = "10px";
            img.style.height = "32px";
            img.style.width = "32px";

            img.onerror = () => {
              console.error(`Error loading image for rune: ${rune.name}`);
            };

            runeContainer.appendChild(img);
          });
        }
      });
    })
    .catch((error) => {
      console.error("Error loading runes:", error);
    });
}

fetchAndDisplayRunes();

runeTypeSelector.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (button) {
    const selectedType = button.dataset.type;
    if (selectedType) {
      fetchAndDisplayRunes(selectedType);
    }
  }
});
