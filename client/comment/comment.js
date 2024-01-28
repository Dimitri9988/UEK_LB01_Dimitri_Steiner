const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('postId');
document.addEventListener('DOMContentLoaded', () => {





  const showTweets = async () => {
    try {
      const respons = await fetch('http://localhost:4200/getComment', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (respons.ok) {
        const result = await respons.json();
        const { allcomment } = result;
        console.log(allcomment)

        for (let i = 0; i < allcomment.length; i++) {
          
          
          if (postId === `${allcomment[i].tweet_id}`) {
            console.log(allcomment[i])
          }

          
        }

      }
    } catch (error) {
      console.error('Fehler beim Laden der Tweets', error);
    }
  };
  showTweets();
































  const showTweet = async () => {
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
        for (let i = 0; i < allpost.length; i++) {
          if (`${allpost[i].tweet_id}` === postId) {
            const postWindow = document.getElementById('postWindow');
            postWindow.innerHTML = `
                <div id="Feedwindow" class="w-full  bg-gradient-to-r rounded-lg mb-1/2">
                    <div class="dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4 w-1/2 mx-auto">
                        <div>
                            <span class="font-semibold text-white">${allpost[i].username}</span>
                        </div>
                        <p class="text-white">${allpost[i].content}</p>
                        <div class="mt-2">
                            <p class="text-white">${allpost[i].post_like}</p>
                        </div>
                    </div>
                </div>`;
          }
        }
      } else {
        console.error('Fehler beim Auslesen des Posts', respons.statusText);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Posts', error);
    }
  };
  showTweet();

  document.getElementById('postCommentButton').addEventListener('click', async (event) => {
    event.preventDefault();
    const commentMessage = document.getElementById('commentTextarea').value;
    const jwtToken = localStorage.getItem('Token');
    try {
      const response = await fetch('http://localhost:4200/createComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentMessage, jwtToken, postId }),
      });
      if (response.ok) {
        console.log('Kommentar erfolgreich gespeichert');
      } else {
        console.error('Fehler bei der Speicherung des Kommentars:', response.statusText);
      }
    } catch (error) {
      console.error('Netzwerkfehler:', error);
    }
  });
});
