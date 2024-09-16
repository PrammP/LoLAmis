function initializeLaneSelection() {
  const laneContainer = document.getElementById("lane");
  const laneImages = laneContainer.getElementsByTagName("img");
  let selectedImage = null;

  function selectLane(image) {
    if (selectedImage) {
      selectedImage.style.width = "96px";
      selectedImage.style.height = "96px";
      selectedImage.classList.remove("selected-lane");
    }

    image.style.width = "128px";
    image.style.height = "128px";
    image.classList.add("selected-lane");
    selectedImage = image;
  }

  Array.from(laneImages).forEach((image) => {
    image.addEventListener("click", function () {
      selectLane(this);
    });

    image.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectLane(this);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", initializeLaneSelection);
