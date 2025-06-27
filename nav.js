document.addEventListener("DOMContentLoaded", async () => {
    const nav = document.getElementById("main-nav");
    try {
      const response = await fetch("/api/nav.html");
      const html = await response.text();
      nav.innerHTML = html;
    } catch (err) {
      nav.innerHTML = `<div style="color:red; padding:1em;">Error loading navigation</div>`;
    }
  });
  