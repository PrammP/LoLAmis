const apiUrl =
  "https://ddragon.leagueoflegends.com/cdn/14.17.1/data/fr_FR/item.json";
const imgBaseUrl = "https://ddragon.leagueoflegends.com/cdn/14.17.1/img/item/";
const itemContainer = document.getElementById("itemContainer");
let selectedSlot = null;
window.onload = () => {
  itemContainer.style.display = "none";
};

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    const items = data.data;

    const componentIds = new Set();

    for (const itemId in items) {
      if (items.hasOwnProperty(itemId)) {
        const item = items[itemId];
        if (item.from) {
          item.from.forEach((componentId) => componentIds.add(componentId));
        }
      }
    }

    for (const itemId in items) {
      if (items.hasOwnProperty(itemId)) {
        const item = items[itemId];

        const isFinalItem = !componentIds.has(itemId);
        const isAvailableOnMap = item.maps["11"];
        const isPurchasable = item.gold.purchasable && item.gold.total > 0;
        const hasNoRequiredChampion = !item.requiredChampion;
        const isNotFromSpecialEvent = !item.hideFromAll;

        if (
          isFinalItem &&
          isAvailableOnMap &&
          isPurchasable &&
          hasNoRequiredChampion &&
          isNotFromSpecialEvent
        ) {
          const img = document.createElement("img");
          img.src = `${imgBaseUrl}${itemId}.png`;
          img.alt = item.name;
          img.dataset.itemId = itemId;
          img.addEventListener("click", () => selectItem(img.src));
          itemContainer.appendChild(img);
        }
      }
    }
  })
  .catch((error) => {
    console.error("Erreur lors du chargement des objets :", error);
  });

document.querySelectorAll(".slot").forEach((slot) => {
  slot.addEventListener("click", () => {
    selectedSlot = slot;
    itemContainer.style.display = "flex";
  });
});

function selectItem(itemSrc) {
  if (selectedSlot) {
    const img = document.createElement("img");
    img.src = itemSrc;
    selectedSlot.innerHTML = "";
    selectedSlot.appendChild(img);
    itemContainer.style.display = "none";
    selectedSlot = null;
  }
}
