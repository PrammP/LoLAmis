import { loadChampions } from "./champion.js";

document.addEventListener("DOMContentLoaded", function () {
  loadChampions();

  document.getElementById("login-btn").addEventListener("click", () => {
    window.location.href = "./auth/login";
  });

  document.getElementById("register-btn").addEventListener("click", () => {
    window.location.href = "./auth/register";
  });
});
