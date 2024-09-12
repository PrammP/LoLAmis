document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/auth/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const profileData = await response.json();

      document.getElementById("accountCreationDate").textContent =
        profileData.creationDate;
      document.getElementById("sharedBuildsCount").textContent =
        profileData.sharedBuildsCount || 0;
      document.getElementById("likesCount").textContent =
        profileData.likesCount || 0;

      document.getElementById(
        "greeting"
      ).textContent = `Bonjour, ${profileData.username}`;
    } else {
      window.location.href = "/auth/login";
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations du profil:",
      error
    );
  }

  document
    .getElementById("logoutButton")
    .addEventListener("click", async () => {
      try {
        const response = await fetch("/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          window.location.href = "/auth/login";
        } else {
          alert("Erreur lors de la déconnexion.");
        }
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
      }
    });
});
