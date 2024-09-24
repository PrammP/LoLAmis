const RUNE_IMG_BASE_URL = "https://ddragon.leagueoflegends.com/cdn/img/";
let runesData = null;

async function fetchRunesData() {
  if (runesData === null) {
    try {
      const response = await fetch(
        "https://ddragon.leagueoflegends.com/cdn/14.17.1/data/fr_FR/runesReforged.json"
      );
      runesData = await response.json();
    } catch (error) {
      console.error("Error fetching rune data:", error);
      runesData = [];
    }
  }
  return runesData;
}

function getRuneIcon(runeId) {
  for (const runeTree of runesData || []) {
    for (const slot of runeTree.slots) {
      for (const rune of slot.runes) {
        if (rune.id === parseInt(runeId)) {
          return rune.icon;
        }
      }
    }
  }
  return "perk-images/Styles/7200_Domination.png";
}

async function displayBuilds() {
  const buildList = document.getElementById("buildList");
  if (buildList) {
    await fetchRunesData();
    const builds = JSON.parse(localStorage.getItem("builds")) || [];

    buildList.innerHTML = builds
      .map(
        (build, index) => `
          <div class="build" data-index="${index}">
            <button class="delete-build" onclick="deleteBuild(${index})">✖</button>
            <h3>${build.name || "Build sans nom"}</h3>
            <p>Rôle: ${build.lane || "Non spécifié"}</p>
            ${
              build.lane
                ? `<img src="${getLaneImage(build.lane)}" alt="${
                    build.lane
                  }" height="96" width="96">`
                : ""
            }
            <p>Champion: ${build.championName || "Non spécifié"}</p>
            ${
              build.championId
                ? `<img src="https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${build.championId}.png" alt="${build.championName}" width="64" height="64">`
                : ""
            }
            <div class="runes">
              ${displayRunesSection(
                build.runes,
                build.runeTypes,
                "container1",
                "Runes principales"
              )}
              ${displayRunesSection(
                build.runes,
                build.runeTypes,
                "container2",
                "Runes secondaires"
              )}
            </div>
            <div class="items">
              <h4>Objets:</h4>
              ${displayItems(build.items)}
            </div>
          </div>
        `
      )
      .join("");
  }
}

function displayItems(items) {
  if (!items || items.length === 0) {
    return "Aucun objet sélectionné";
  }

  return items
    .map(
      (itemSrc) => `
    <img src="${itemSrc}" alt="Objet" width="32" height="32">
  `
    )
    .join("");
}

function deleteBuild(index) {
  let builds = JSON.parse(localStorage.getItem("builds")) || [];

  builds.splice(index, 1);

  localStorage.setItem("builds", JSON.stringify(builds));

  displayBuilds();
}

function displayRunesSection(runes, runeTypes, containerKey, title) {
  if (!runes || !runes[containerKey] || runes[containerKey].length === 0) {
    return "";
  }

  return `
    <h4>${title} ${
    runeTypes && runeTypes[containerKey] ? `(${runeTypes[containerKey]})` : ""
  }:</h4>
    ${displayRunes(runes[containerKey])}
  `;
}

function displayRunes(runes) {
  if (!runes || runes.length === 0) {
    return "Aucune rune sélectionnée";
  }

  return runes
    .map(
      (rune) => `
    <img src="${RUNE_IMG_BASE_URL}${getRuneIcon(
        rune.id
      )}" alt="Rune" title="Rune ID: ${rune.id}" width="32" height="32">
  `
    )
    .join("");
}

function initializeBuildManager() {
  const saveButton = document.getElementById("saveBuild");
  if (saveButton) {
    saveButton.addEventListener("click", saveBuild);
  }
}
function getLaneImage(lane) {
  switch (lane.toLowerCase()) {
    case "top":
      return "lane/white-top.webp";
    case "jungle":
      return "lane/white-jungle.webp";
    case "middle":
      return "lane/white-middle.webp";
    case "bottom":
      return "lane/white-bottom.webp";
    case "support":
      return "lane/white-support.webp";
    default:
      return "";
  }
}

function saveBuild() {
  const buildName = document.getElementById("buildName").value;
  const selectedLane = document.querySelector(".selected-lane");
  const selectedChampion = document.getElementById("championSelect");

  if (!buildName || !selectedLane || !selectedChampion.value) {
    alert(
      "Veuillez entrer un nom de build, sélectionner un rôle et choisir un champion."
    );
    return;
  }

  const selectedRunes = window.selectedRunes || {
    container1: [],
    container2: [],
  };
  const selectedTypes = window.selectedTypes || {
    container1: null,
    container2: null,
  };

  if (
    selectedRunes.container1.length === 0 ||
    selectedRunes.container2.length === 0
  ) {
    alert("Veuillez sélectionner des runes pour les deux conteneurs.");
    return;
  }

  const selectedItems = [];
  document.querySelectorAll(".slot").forEach((slot) => {
    const img = slot.querySelector("img");
    if (img) {
      selectedItems.push(img.src);
    }
  });

  const build = {
    name: buildName,
    lane: selectedLane.alt,
    championId: selectedChampion.value,
    championName: selectedChampion.options[selectedChampion.selectedIndex].text,
    runes: selectedRunes,
    runeTypes: selectedTypes,
    items: selectedItems,
  };

  let builds = JSON.parse(localStorage.getItem("builds")) || [];
  builds.push(build);
  localStorage.setItem("builds", JSON.stringify(builds));

  alert("Build sauvegardé avec succès !");
}

document.addEventListener("DOMContentLoaded", initializeBuildManager);

if (window.location.pathname.includes("communaute.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    displayBuilds().catch((error) =>
      console.error("Error displaying builds:", error)
    );
  });
}
window.deleteBuild = deleteBuild;
