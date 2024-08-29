class Ability {
  constructor(nom, description, imageUrl) {
    this.nom = nom;
    this.description = description;
    this.imageUrl = imageUrl;
  }
}

class Champion {
  constructor(
    nom,
    vie,
    armure,
    mana,
    resistanceMagique,
    degatsAttaque,
    porteeAttaque,
    vitesseMouvement,
    vitesseAttaque
  ) {
    this.nom = nom;
    this.vie = vie;
    this.armure = armure;
    this.mana = mana;
    this.resistanceMagique = resistanceMagique;
    this.degatsAttaque = degatsAttaque;
    this.porteeAttaque = porteeAttaque;
    this.vitesseMouvement = vitesseMouvement;
    this.vitesseAttaque = vitesseAttaque;
  }
}

class Passive {
  constructor(nom, description, imageUrl) {
    this.nom = nom;
    this.description = description;
    this.imageUrl = imageUrl;
  }
}

fetch(
  "https://ddragon.leagueoflegends.com/cdn/14.17.1/data/en_US/champion.json"
)
  .then((response) => response.json())
  .then((data) => {
    const champions = data.data;
    const select = document.getElementById("championSelect");

    for (const key in champions) {
      const champion = champions[key];
      const option = document.createElement("option");
      option.value = champion.id;
      option.text = champion.name;
      select.appendChild(option);
    }

    select.addEventListener("change", function () {
      const selectedChampionId = this.value;

      fetch(
        `https://ddragon.leagueoflegends.com/cdn/14.17.1/data/en_US/champion/${selectedChampionId}.json`
      )
        .then((response) => response.json())
        .then((data) => {
          const selectedChampionData = data.data[selectedChampionId];
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

            const abilitiesDisplay =
              document.getElementById("championAbilities");
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
                <img src="${ability.imageUrl}" alt="${ability.nom}"  title="${ability.description}" style="width: 50px; height: 50px;">
                <p><strong>${ability.nom}</strong></p>
              `;
              abilitiesDisplay.appendChild(abilityElement);
            });

            display.style.display = "flex";
          } else {
            display.style.display = "none";
          }
        })
        .catch((error) =>
          console.error("Error fetching champion details:", error)
        );
    });
  })
  .catch((error) => console.error("Error fetching champion data:", error));
