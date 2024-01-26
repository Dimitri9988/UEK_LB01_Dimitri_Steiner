/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('registerNavigationButton').addEventListener('click', () => {
    const register = 'authentication/register.html';
    window.location.href = `/${register}`;
  });

  document.getElementById('AdminButton').addEventListener('click', async () => {
    jwtToken = localStorage.getItem('Token');

    try {
      const response = await fetch('http://localhost:4200/permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwtToken }), // Pass jwtToken as an object property
      });

      if (response.ok) {
        const result = await response.json();
        const { permission } = result;
        if (permission === true) {
          console.log('You are an Admin');
        } else {
          console.log('You are not an admin');
        }
      } else {
        console.error('Fehler bei der Übertragung:', response.statusText);
      }
    } catch (error) {
      console.error('Fehler beim Fetch:', error);
    }
  });

  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const LoginUsername = document.getElementById('loginUsername').value;
    const LoginPassword = document.getElementById('loginPassword').value;

    try {
      const response = await fetch('http://localhost:4200/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ LoginPassword, LoginUsername }),
      });

      if (response.ok) {
        const result = await response.json();
        const { token } = result;
        console.log('Login erfolgreich.');
        localStorage.setItem('Token', token);
        const feed = 'feed/feed.html';
        window.location.href = `/${feed}`;
      } else {
        console.error('Fehler beim Login:', response.statusText);
      }
    } catch (error) {
      console.error('Netzwerkfehler:', error);
    }
  });
});
