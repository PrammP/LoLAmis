import { Champion, Passive, Ability } from "./classes.js";

function loadChampions() {
  const select = document.getElementById("championSelect");
  fetch("/api/champions")
    .then((response) => response.json())
    .then((data) => {
      const champions = data.data;
      for (const key in champions) {
        const champion = champions[key];
        const option = document.createElement("option");
        option.value = champion.id;
        option.text = champion.name;
        select.appendChild(option);
      }
      select.addEventListener("change", function () {
        const selectedChampionId = this.value;
        loadChampionDetails(selectedChampionId);
      });
    })
    .catch((error) => console.error("Error fetching champion data:", error));
}

function loadChampionDetails(championId) {
  fetch(`/api/champions/${championId}`)
    .then((response) => response.json())
    .then((data) => {
      const selectedChampionData = data.data[championId];
      const display = document.getElementById("championDisplay");

      if (selectedChampionData) {
        const champion = new Champion(selectedChampionData.name);

        const imageUrl = `https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${selectedChampionData.image.full}`;
        document.getElementById("championImage").src = imageUrl;
        document.getElementById("championName").textContent = champion.nom;

        display.style.display = "flex";
      } else {
        display.style.display = "none";
      }
    })
    .catch((error) => console.error("Error fetching champion details:", error));
}

export { loadChampions };
