// Définir les constantes et les variables globales
const API_KEY = '93815a24429f4daba4bd9c626ca46d59';
let currentPage = 1;
const gamesPerPage = 9;
let allArticles = []; // Stocker tous les jeux récupérés

// Récupérer les éléments HTML
const searchInput = document.getElementById('searchInput');
const gameResults = document.getElementById('gameResults');
const showMoreButton = document.getElementById('showMoreButton');
const platformFilter = document.getElementById('platformFilter');

// Définir les plateformes disponibles
const platforms = ['PC', 'PlayStation 3', 'PlayStation 4', 'PlayStation 5', 'Xbox', 'Xbox 360', 'Xbox One', 'Xbox Series S/X', 'Nintendo Switch', 'iOS', 'macOS', 'Android', 'Linux', 'Web'];

// Fonction pour afficher les plateformes disponibles dans l'interface utilisateur
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

// Gérer la recherche et afficher les résultats
const handleSearch = (searchWord, platform = '') => {
  let url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${searchWord}&page=${currentPage}`;

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
            const filteredArticles = platform ? validArticles.filter(article => {
              return article.platforms.some(platformObj => platformObj.platform.name === platform);
            }) : validArticles;

            allArticles = filteredArticles;
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

// Afficher les résultats
const displayGameResults = () => {
  const start = (currentPage - 1) * gamesPerPage;
  const end = start + gamesPerPage;
  const currentArticles = allArticles.slice(start, end);
  const resultsContent = currentArticles.map((article) => {
    const platformNames = article.platforms.map(platform => platform.platform.name).join(', ');
    return (
      `<article class="cardGame" data-gameid="${article.id}">
        <img src="${article.background_image}" alt="${article.name}" class="game-image">
        <h1>${article.name}</h1>
        <p class="platforms">Platforms: ${platformNames}</p>
      </article>`
    );
  });
  if (gameResults) {
    gameResults.innerHTML = resultsContent.join("\n");
    attachCardClickEvent(); // Attacher le gestionnaire d'événements après le rendu des résultats
    checkShowMoreButtonVisibility();
  } else {
    console.error("Error: gameResults is not defined or could not be found.");
  }
};

// Attacher un gestionnaire d'événements au clic sur chaque carte de jeu
const attachCardClickEvent = () => {
  const cardGames = document.querySelectorAll('.cardGame');
  cardGames.forEach(cardGame => {
    cardGame.addEventListener('click', () => {
      const gameId = cardGame.getAttribute('data-gameid');
      // Redirection vers la page de détails
      window.location.href = `#pagedetails/${gameId}`;
    });
  });
};

// Afficher ou masquer le bouton "Show More"
const checkShowMoreButtonVisibility = () => {
  if (showMoreButton) {
    const start = (currentPage - 1) * gamesPerPage;
    const end = start + gamesPerPage;
    showMoreButton.style.display = allArticles.length > end ? 'block' : 'none';
  } else {
    console.error("Error: showMoreButton is not defined or could not be found.");
  }
};

// Click bouton Show more
showMoreButton.addEventListener('click', () => {
  currentPage++;
  handleSearch(searchInput.value.trim(), platformFilter.value); // Utiliser le filtre de plateforme actuel lors du chargement des jeux supplémentaires
});

// Gestion de la soumission du formulaire de recherche
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
    handleSearch(searchWord, platformFilter.value); // Utiliser le filtre de plateforme actuel lors de la recherche
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















