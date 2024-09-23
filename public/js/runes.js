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

window.selectedTypes = { container1: null, container2: null };
window.selectedRunes = { container1: [], container2: [] };

function createRuneRow() {
  const row = document.createElement("div");
  row.className = "rune-row";
  row.style.display = "flex";
  row.style.justifyContent = "center";
  return row;
}

function appendRuneImage(rune, container, isPrimary, rowIndex) {
  const imgUrl = `${imgBaseUrl}${rune.icon}`;
  const img = document.createElement("img");
  img.src = imgUrl;
  img.alt = rune.name;
  img.style.margin = "10px";
  img.style.height = "48px";
  img.style.width = "48px";
  img.dataset.runeId = rune.id;
  img.dataset.rowIndex = rowIndex;
  img.onerror = () => {
    console.error(`Error loading image for rune: ${rune.name}`);
  };

  img.addEventListener("click", () =>
    toggleRuneSelection(img, container, isPrimary)
  );
  img.setAttribute("tabindex", "0");
  img.setAttribute("role", "button");
  img.setAttribute("aria-label", `Sélectionner la rune ${rune.name}`);
  img.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleRuneSelection(img, container, isPrimary);
    }
  });

  container.appendChild(img);
}

function toggleRuneSelection(img, container, isPrimary) {
  const runeId = img.dataset.runeId;
  const containerType = isPrimary ? "container1" : "container2";
  const maxSelections = isPrimary ? 4 : 2;
  const rowIndex = parseInt(img.dataset.rowIndex);

  if (img.classList.contains("selected")) {
    img.classList.remove("selected");
    window.selectedRunes[containerType] = window.selectedRunes[
      containerType
    ].filter((rune) => rune.id !== runeId);
  } else {
    if (window.selectedRunes[containerType].length < maxSelections) {
      const previouslySelected = Array.from(
        container.querySelectorAll(".selected")
      ).find((selected) => parseInt(selected.dataset.rowIndex) === rowIndex);
      if (previouslySelected) {
        previouslySelected.classList.remove("selected");
        window.selectedRunes[containerType] = window.selectedRunes[
          containerType
        ].filter((rune) => rune.id !== previouslySelected.dataset.runeId);
      }

      img.classList.add("selected");
      window.selectedRunes[containerType].push({ id: runeId, row: rowIndex });
    } else {
      alert(
        `Vous ne pouvez sélectionner que ${maxSelections} runes au maximum dans ce conteneur.`
      );
      return;
    }
  }

  updateRuneStates(containerType);
}

function updateRuneStates(containerType) {
  const container =
    containerType === "container1" ? runeContainer1 : runeContainer2;
  const allRunes = container.querySelectorAll("img");
  const selectedCount = selectedRunes[containerType].length;
  const maxSelections = containerType === "container1" ? 4 : 2;

  allRunes.forEach((img) => {
    const isSelected = img.classList.contains("selected");
    const canSelect = selectedCount < maxSelections || isSelected;

    img.classList.toggle("disabled", !canSelect);
    img.style.opacity = canSelect ? "1" : "0.5";
    img.style.cursor = canSelect ? "pointer" : "not-allowed";
    img.setAttribute("aria-disabled", !canSelect);
    img.setAttribute("aria-selected", isSelected);
  });
}

function clearContainer(container) {
  container.innerHTML = "";
}

function fetchAndDisplayRunes(selectedType, container, isPrimary) {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((runes) => {
      if (isPrimary) {
        clearContainer(runeTop1);
        clearContainer(runeMid1);
        clearContainer(runeBot1);
        clearContainer(runeSuperBot1);
        runeContainer1.style.display = "flex";
        runeContainer1.style.flexDirection = "column";

        runes.forEach((runeTree) => {
          if (runeTree.key === selectedType) {
            runeTree.slots.forEach((slot, slotIndex) => {
              const targetContainer = [
                runeTop1,
                runeMid1,
                runeBot1,
                runeSuperBot1,
              ][slotIndex];
              const row = createRuneRow();
              targetContainer.appendChild(row);
              slot.runes.forEach((rune) =>
                appendRuneImage(rune, row, true, slotIndex)
              );
            });
          }
        });
      } else {
        clearContainer(runeTop2);
        clearContainer(runeMid2);
        clearContainer(runeBot2);
        runeContainer2.style.display = "flex";
        runeContainer2.style.flexDirection = "column";

        runes.forEach((runeTree) => {
          if (runeTree.key === selectedType) {
            const secondaryRunes = runeTree.slots
              .slice(1)
              .flatMap((slot) => slot.runes);
            [runeTop2, runeMid2, runeBot2].forEach((container, index) => {
              const row = createRuneRow();
              container.appendChild(row);
              secondaryRunes
                .slice(index * 3, (index + 1) * 3)
                .forEach((rune) => appendRuneImage(rune, row, false, index));
            });
          }
        });
      }
      updateRuneStates(isPrimary ? "container1" : "container2");
    })
    .catch((error) => {
      console.error("Error loading runes:", error);
    });
}

function handleRuneSelection(selectedType) {
  if (!window.selectedTypes.container1) {
    if (window.selectedTypes.container2 !== selectedType) {
      window.selectedTypes.container1 = selectedType;
      fetchAndDisplayRunes(selectedType, runeContainer1, true);
    } else {
      alert("Ce type de rune est déjà sélectionné dans le second conteneur.");
    }
  } else if (!window.selectedTypes.container2) {
    if (window.selectedTypes.container1 !== selectedType) {
      window.selectedTypes.container2 = selectedType;
      fetchAndDisplayRunes(selectedType, runeContainer2, false);
    } else {
      alert("Ce type de rune est déjà sélectionné dans le premier conteneur.");
    }
  } else {
    alert("Les deux conteneurs sont déjà remplis. Réinitialisation.");
    window.selectedTypes = { container1: null, container2: null };
    window.selectedRunes = { container1: [], container2: [] };
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

const runeTypeSelector = document.getElementById("runeTypeSelector");
runeTypeSelector.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (button) {
    const selectedType = button.dataset.type;

    if (selectedType) {
      handleRuneSelection(selectedType);
    }
  }
});
