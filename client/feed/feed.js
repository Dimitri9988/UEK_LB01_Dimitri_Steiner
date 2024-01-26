document.addEventListener('DOMContentLoaded', () => {

  const postWindow = document.getElementById('Feedwindow');

  const showTweets = async () => {
    try {
      const respons = await fetch('http://localhost:4200/getPost', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (respons.ok) {
        const result = await respons.json();
        const { allpost } = result;
        console.log(allpost);



        for (let i = 0; i < allpost.length; i++) {
          const post = 
          `
          <div class="dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4 w-1/2 mx-auto">
            <div>
                <span class="font-semibold text-white">${allpost[i].username}</span>
            </div>
            <p class="text-white">${allpost[i].content}</p>
            <div class="mt-2">
                <button class="text-blue-500 hover:underline">Like</button>
                <button class="text-gray-500 hover:underline ml-2">Comment</button>
            </div>
        </div>
        `
        postWindow.innerHTML += post
        }







        console.log(allpost[0].username)
      } else {
        console.error('Fehler beim Auslesen der Posts', respons.statusText);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Tweets', error);
    }
  };
  
  showTweets();










  document.getElementById('postButton').addEventListener('click', async (event) => {
    event.preventDefault();
    const postMessage = document.getElementById('postTextarea').value;
    const jwtToken = localStorage.getItem('Token');
    try {
      const response = await fetch('http://localhost:4200/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postMessage, jwtToken }),
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
