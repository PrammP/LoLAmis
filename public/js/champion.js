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
        const champion = new Champion(
          selectedChampionData.name,
          selectedChampionData.stats.hp,
          selectedChampionData.stats.armor,
          selectedChampionData.stats.mp,
          selectedChampionData.stats.spellblock,
          selectedChampionData.stats.attackdamage,
          selectedChampionData.stats.attackrange,
          selectedChampionData.stats.movespeed,
          selectedChampionData.stats.attackspeed
        );

        const imageUrl = `https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${selectedChampionData.image.full}`;
        document.getElementById("championImage").src = imageUrl;
        document.getElementById("championName").textContent = champion.nom;

        document.getElementById("championStats").innerHTML = `
          <p>Life: ${champion.vie}</p>
          <p>Armor: ${champion.armure}</p>
          <p>Mana: ${champion.mana}</p>
          <p>RM: ${champion.resistanceMagique}</p>
          <p>Attack damage: ${champion.degatsAttaque}</p>
          <p>Range: ${champion.porteeAttaque}</p>
          <p>Movespeed: ${champion.vitesseMouvement}</p>
          <p>Attackspeed: ${champion.vitesseAttaque}</p>
        `;

        const passiveData = selectedChampionData.passive;
        const passive = new Passive(
          passiveData.name,
          passiveData.description,
          `https://ddragon.leagueoflegends.com/cdn/14.17.1/img/passive/${passiveData.image.full}`
        );

        const passiveDisplay = document.getElementById("championPassive");
        passiveDisplay.innerHTML = `
          <h3>Passif :</h3>
          <img src="${passive.imageUrl}" alt="${passive.nom}" title="${passive.description}" style="width: 50px; height: 50px;">
          <p><strong>${passive.nom}</strong><p/>
        `;

        const abilitiesDisplay = document.getElementById("championAbilities");
        abilitiesDisplay.innerHTML = "";

        const abilities = selectedChampionData.spells.map((spell) => {
          return new Ability(
            spell.name,
            spell.description,
            `https://ddragon.leagueoflegends.com/cdn/14.17.1/img/spell/${spell.image.full}`
          );
        });

        abilities.forEach((ability) => {
          const abilityElement = document.createElement("div");
          abilityElement.innerHTML = `
          <div id="capacity">
            <img src="${ability.imageUrl}" alt="${ability.nom}" title="${ability.description}" style="width: 50px; height: 50px;">
            <p><strong>${ability.nom}</strong></p>
            </div>
          `;
          abilitiesDisplay.appendChild(abilityElement);
        });

        display.style.display = "flex";
      } else {
        display.style.display = "none";
      }
    })
    .catch((error) => console.error("Error fetching champion details:", error));
}

export { loadChampions };
