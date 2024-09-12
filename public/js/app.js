import { loadChampions } from "./champion.js";

document.addEventListener("DOMContentLoaded", async function () {
  loadChampions();

  document.getElementById("login-btn").addEventListener("click", () => {
    window.location.href = "./auth/login";
  });

  document.getElementById("register-btn").addEventListener("click", () => {
    window.location.href = "./auth/register";
  });

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

      const greeting = document.getElementById("greeting");
      const welcomeMessage = document.getElementById("welcomeMessage");
      const profileBtn = document.getElementById("profile-btn");

      welcomeMessage.textContent = `Bonjour, ${profileData.username}`;
      greeting.style.display = "block";
      profileBtn.style.display = "inline-block";

      document.getElementById("userActions").style.display = "none";

      profileBtn.addEventListener("click", () => {
        window.location.href = "/profile";
      });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de la connexion:", error);
  }
});
