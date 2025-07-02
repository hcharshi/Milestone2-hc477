document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/get-profile')
    .then(response => response.json())
    .then(data => {
      if (data && data.email && data.username) {
        document.getElementById('email').value = data.email;
        document.getElementById('username').value = data.username;
      } else {
        alert('Could not load profile data');
      }
    })
    .catch(error => {
      console.error('Error fetching profile:', error);
    });
});
