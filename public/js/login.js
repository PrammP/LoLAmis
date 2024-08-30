document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(loginForm);
      const data = {
        username: formData.get("username"),
        password: formData.get("password"),
      };

      try {
        const response = await fetch("/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          window.location.href = "/";
        } else {
          const text = await response.text();
          alert(text);
        }
      } catch (error) {
        console.error("Erreur lors de la connexion:", error);
      }
    });
  }
});
