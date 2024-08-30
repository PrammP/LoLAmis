document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(registerForm);
      const data = {
        username: formData.get("username"),
        password: formData.get("password"),
      };

      try {
        const response = await fetch("/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          window.location.href = "/auth/login";
        } else {
          const text = await response.text();
          alert(text);
        }
      } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
      }
    });
  }
});
