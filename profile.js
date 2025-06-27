document.addEventListener("DOMContentLoaded", async () => {
  const emailField = document.getElementById("email");
  const usernameField = document.getElementById("username");
  const passwordField = document.getElementById("password");
  const form = document.getElementById("profile-form");
  const feedback = document.getElementById("feedback");

  try {
    const response = await fetch("/api/get-profile.php", {
      credentials: "include"
    });
    if (!response.ok) throw new Error("Failed to load profile.");
    const user = await response.json();

    emailField.value = user.email || "";
    usernameField.value = user.username || "";
  } catch (err) {
    feedback.textContent = "Could not load your profile info.";
    feedback.style.color = "#ff6b6b";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    feedback.textContent = "";

    const email = emailField.value.trim();
    const username = usernameField.value.trim();
    const password = passwordField.value;

    const errors = [];

    if (!email.includes("@") || !email.includes(".")) {
      errors.push("Please enter a valid email address.");
    }

    if (username.length < 3) {
      errors.push("Username must be at least 3 characters.");
    }

    if (password && password.length < 8) {
      errors.push("Password must be at least 8 characters.");
    }

    if (errors.length > 0) {
      feedback.textContent = errors.join(" ");
      feedback.style.color = "#ff6b6b";
      return;
    }

    try {
      const result = await fetch("/api/update-profile.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, username, password })
      });

      const data = await result.json();
      if (data.success) {
        feedback.style.color = "limegreen";
        feedback.textContent = "✅ Profile updated successfully!";
        passwordField.value = "";
      } else {
        feedback.style.color = "#ff6b6b";
        feedback.textContent = "❌ " + (data.message || "Profile update failed.");
      }
    } catch (err) {
      feedback.style.color = "#ff6b6b";
      feedback.textContent = "❌ Server error. Try again later.";
    }
  });
});
