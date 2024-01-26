document.addEventListener('DOMContentLoaded', () => {
  const postWindow = document.getElementById('Feedwindow');
  document.getElementById('postButton').addEventListener('click', async (event) => {
    event.preventDefault();
    const postMessage = document.getElementById('postTextarea').value;

    try {
      const response = await fetch('http://localhost:4200/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postMessage }),
      });
      if (response.ok) {
        console.log('Post erfolgreich gespeichert');
      } else {
        console.error('Fehler bei der Speicherung des Postes:', response.statusText);
      }
    } catch (error) {
      console.error('Netzwerkfehler:', error);
    }
  });
});
