const form = document.getElementById("login-form");
const errorEl = document.getElementById("form-error");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorEl.hidden = true;
  errorEl.textContent = "";
  submitBtn.disabled = true;

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.detail || "Could not sign in");
    }

    sessionStorage.setItem("aiqmx_token", payload.access_token);
    sessionStorage.setItem("aiqmx_email", payload.email);
    window.location.href = "/app.html";
  } catch (err) {
    errorEl.textContent = err.message || "Could not sign in";
    errorEl.hidden = false;
  } finally {
    submitBtn.disabled = false;
  }
});
