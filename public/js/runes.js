const apiUrl =
  "https://ddragon.leagueoflegends.com/cdn/14.17.1/data/fr_FR/runesReforged.json";
const imgBaseUrl = "https://ddragon.leagueoflegends.com/cdn/img/";

const runeContainer1 = document.getElementById("runeContainer1");
const runeContainer2 = document.getElementById("runeContainer2");

const runeTop1 = document.getElementById("runeTop1");
const runeMid1 = document.getElementById("runeMid1");
const runeBot1 = document.getElementById("runeBot1");
const runeSuperBot1 = document.getElementById("runeSuperBot1");

const runeTop2 = document.getElementById("runeTop2");
const runeMid2 = document.getElementById("runeMid2");
const runeBot2 = document.getElementById("runeBot2");

runeContainer1.style.display = "none";
runeContainer2.style.display = "none";

let selectedTypes = { container1: null, container2: null };

function appendRuneImage(rune, container) {
  const imgUrl = `${imgBaseUrl}${rune.icon}`;
  const img = document.createElement("img");
  img.src = imgUrl;
  img.alt = rune.name;
  img.style.margin = "10px";
  img.style.height = "48px";
  img.style.width = "48px";
  img.onerror = () => {
    console.error(`Error loading image for rune: ${rune.name}`);
  };

  container.appendChild(img);
}

function clearContainer(container) {
  container.innerHTML = "";
}

function fetchAndDisplayRunes(selectedType, container, isPrimary) {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((runes) => {
      if (isPrimary) {
        runeTop1.innerHTML = "";
        runeMid1.innerHTML = "";
        runeBot1.innerHTML = "";
        runeSuperBot1.innerHTML = "";
        runeContainer1.style.display = "flex";

        runes.forEach((runeTree) => {
          if (runeTree.key === selectedType) {
            const primaryRunes = runeTree.slots.flatMap((slot) => slot.runes);

            primaryRunes
              .slice(0, 3)
              .forEach((rune) => appendRuneImage(rune, runeTop1));

            primaryRunes
              .slice(3, 6)
              .forEach((rune) => appendRuneImage(rune, runeMid1));

            primaryRunes
              .slice(6, 9)
              .forEach((rune) => appendRuneImage(rune, runeBot1));

            primaryRunes
              .slice(9, 12)
              .forEach((rune) => appendRuneImage(rune, runeSuperBot1));
          }
        });
      } else {
        clearContainer(runeTop2);
        clearContainer(runeMid2);
        clearContainer(runeBot2);
        runeContainer2.style.display = "flex";

        runes.forEach((runeTree) => {
          if (runeTree.key === selectedType) {
            const primaryRunes = runeTree.slots.flatMap((slot) => slot.runes);
            const remainingRunes = primaryRunes.slice(3);

            remainingRunes
              .slice(0, 3)
              .forEach((rune) => appendRuneImage(rune, runeTop2));

            remainingRunes
              .slice(3, 6)
              .forEach((rune) => appendRuneImage(rune, runeMid2));

            remainingRunes
              .slice(6, 9)
              .forEach((rune) => appendRuneImage(rune, runeBot2));
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error loading runes:", error);
    });
}

function handleRuneSelection(selectedType) {
  if (!selectedTypes.container1) {
    if (selectedTypes.container2 !== selectedType) {
      selectedTypes.container1 = selectedType;
      fetchAndDisplayRunes(selectedType, runeContainer1, true);
    } else {
      alert("Ce type de rune est déjà sélectionné dans le second conteneur.");
    }
  } else if (!selectedTypes.container2) {
    if (selectedTypes.container1 !== selectedType) {
      selectedTypes.container2 = selectedType;
      fetchAndDisplayRunes(selectedType, runeContainer2, false);
    } else {
      alert("Ce type de rune est déjà sélectionné dans le premier conteneur.");
    }
  } else {
    alert("Les deux conteneurs sont déjà remplis. Réinitialisation.");
    selectedTypes = { container1: null, container2: null };
    runeContainer1.style.display = "none";
    runeContainer2.style.display = "none";
    clearContainer(runeTop1);
    clearContainer(runeMid1);
    clearContainer(runeBot1);
    clearContainer(runeSuperBot1);
    clearContainer(runeTop2);
    clearContainer(runeMid2);
    clearContainer(runeBot2);
  }
}

runeTypeSelector.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (button) {
    const selectedType = button.dataset.type;

    if (selectedType) {
      handleRuneSelection(selectedType);
    }
  }
});
