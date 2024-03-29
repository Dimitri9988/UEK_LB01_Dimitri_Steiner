/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginNavigationButton').addEventListener('click', () => {
    const login = '../index.html';
    window.location.href = `/${login}`;
  }); 
  document.getElementById('registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    try {
      const response = await fetch('http://localhost:4200/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });
      if (response.ok) {
        console.log('Registrierung erfolgreich.');
      } else {
        console.error('Fehler bei der Registrierung:', response.statusText);
      }
    } catch (error) {
      console.error('Netzwerkfehler:', error);
    }
  });
});
