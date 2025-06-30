document.getElementById('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (!email.includes('@')) {
    alert('Invalid email format.');
    return;
  }

  if (username.length < 3) {
    alert('Username must be at least 3 characters.');
    return;
  }

  if (password && password.length < 8) {
    alert('Password must be at least 8 characters.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  const response = await fetch('/api/update-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  });

  const result = await response.json();

  if (result.success) {
    alert('Profile updated successfully.');
    window.location.reload();
  } else {
    alert(`Update failed: ${result.message}`);
  }
});
