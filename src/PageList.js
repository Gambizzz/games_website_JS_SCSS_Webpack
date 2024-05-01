const API_KEY = '93815a24429f4daba4bd9c626ca46d59';
let currentPage = 1;
const gamesPerPage = 9;
let allArticles = [];

const searchInput = document.getElementById('searchInput');
const gameResults = document.getElementById('gameResults');
const showMoreButton = document.getElementById('showMoreButton');
const platformFilter = document.getElementById('platformFilter');

//plateformes disponibles
const platforms = ['PC', 'PlayStation 3', 'PlayStation 4', 'PlayStation 5', 'Xbox', 'Xbox 360', 'Xbox One', 'Xbox Series S/X', 'Nintendo Switch', 'iOS', 'macOS', 'Android', 'Linux', 'Web'];

//afficher les plateformes disponibles dans l'UI
const displayPlatforms = () => {
  if (platformFilter) {
    const options = platforms.map(platform => `<option value="${platform}">${platform}</option>`);
    platformFilter.innerHTML = `<option value="">All Platforms</option>${options.join('')}`;
    platformFilter.addEventListener('change', () => {
      currentPage = 1;
      handleSearch(searchInput.value.trim(), platformFilter.value);
    });
  } else {
    console.error("Error: platformFilter is not defined or could not be found.");
  }
};

//gérer la recherche et afficher les résultats
const handleSearch = (searchWord, platform = '') => {
  let url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${searchWord}&page=${currentPage}`;
  if (platform) {
    url += `&platforms=${platform}`;
  }

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('API request error !');
      }
      return response.json();
    })
    .then(data => {
      if (data.results.length > 0) {
        if (currentPage === 1) {
          allArticles = data.results;
        } else {
          allArticles = allArticles.concat(data.results);
        }

        //récupère les détails de chaque jeu, y compris les plateformes disponibles
        const promises = allArticles.map(article => {
          return fetch(`https://api.rawg.io/api/games/${article.id}?key=${API_KEY}`)
            .then(response => {
              if (!response.ok) {
                throw new Error('API request error !');
              }
              return response.json();
            })
            .then(gameData => {
              article.platforms = gameData.platforms;
              return article;
            })
            .catch(error => {
              console.error('API request error !', error);
              return null;
            });
        });

        Promise.all(promises)
          .then(articlesWithPlatforms => {
            const validArticles = articlesWithPlatforms.filter(article => article !== null);
            allArticles = validArticles;
            displayGameResults();
          });
      } else {
        gameResults.innerHTML = '<p> No result !</p>';
      }
    })
    .catch(error => {
      console.error('API request error !', error);
      gameResults.innerHTML = '<p> Problem while searching... </p>';
    });
};

//afficher les résultats
const displayGameResults = () => {
  const start = (currentPage - 1) * gamesPerPage;
  const end = start + gamesPerPage;
  const currentArticles = allArticles.slice(0, end);
  const resultsContent = currentArticles.map((article) => {
    const platformNames = article.platforms.map(platform => platform.platform.name).join(', ');
    return (
      `<article class="cardGame" data-gameid="${article.id}">
        <img src="${article.background_image}" alt="${article.name}" class="game-image">
        <h1>${article.name}</h1>
        <p class="platforms">${platformNames}</p> 
      </article>`
    );
  });
  if (gameResults) {
    gameResults.innerHTML = resultsContent.join("\n");
    checkShowMoreButtonVisibility();
    attachCardClickEvent();
  } else {
    console.error("Error: gameResults is not defined or could not be found.");
  }
};

//bouton Show more
showMoreButton.addEventListener('click', () => {
  currentPage++;
  displayGameResults();
});

//vérifier la visibilité du bouton "Show more"
const checkShowMoreButtonVisibility = () => {
  if (currentPage >= 4) { //masque le bouton après 2 clics
    showMoreButton.classList.add('hide');
  } else {
    showMoreButton.classList.remove('hide');
  }
};

//attacher un gestionnaire d'événements à chaque carte de jeu
const attachCardClickEvent = () => {
  const cardGames = document.querySelectorAll('.cardGame');
  cardGames.forEach(card => {
    card.addEventListener('click', () => {
      const gameId = card.getAttribute('data-gameid');
      window.location.href = `#pagedetails/${gameId}`;
    });
  });
};

//soumission du formulaire de recherche
searchInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const searchWord = searchInput.value.trim();

    if (!searchWord) {
      alert('Write something before submit !');
      return;
    }

    currentPage = 1;
    allArticles = [];
    handleSearch(searchWord);
  }
});

// PageList
const PageList = () => {
  const render = () => {
    const resultContent = document.getElementById('gameResults');
    if (resultContent) {
      resultContent.innerHTML = `
        <section class="page-list">
          <div class="articles">Loading...</div>
        </section>
      `;
      handleSearch('');
      displayPlatforms();
    } else {
      console.error("Error: gameResults is not defined or could not be found.");
    }
  };

  render();
};

PageList();















