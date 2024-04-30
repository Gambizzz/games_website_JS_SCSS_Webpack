const API_KEY = 'b8eb809043eb46e997fff7cc1e72d5fb';
let currentPage = 1;
const gamesPerPage = 9;
let allArticles = []; // Stocker tous les jeux récupérés

const searchInput = document.getElementById('searchInput');
const gameResults = document.getElementById('gameResults');
const showMoreButton = document.getElementById('showMoreButton');

// Gérer la recherche et afficher les résultats
const handleSearch = (searchWord) => {
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${searchWord}&page=${currentPage}`;

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
          allArticles = data.results; // Réinitialise la liste des articles avec les nouveaux résultats
        } else {
          allArticles = allArticles.concat(data.results); // Ajoute les nouveaux articles à ceux déjà récupérés
        }

        // Récupérer les détails de chaque jeu, y compris les plateformes disponibles
        const promises = allArticles.map(article => {
          return fetch(`https://api.rawg.io/api/games/${article.id}?key=${API_KEY}`)
            .then(response => {
              if (!response.ok) {
                throw new Error('API request error !');
              }
              return response.json();
            })
            .then(gameData => {
              // Ajouter les détails des plateformes au jeu
              article.platforms = gameData.platforms;
              return article;
            })
            .catch(error => {
              console.error('API request error !', error);
              return null;
            });
        });

        // Attendre que toutes les requêtes soient terminées
        Promise.all(promises)
          .then(articlesWithPlatforms => {
            // Filtrer les résultats nulls (en cas d'erreur)
            const validArticles = articlesWithPlatforms.filter(article => article !== null);
            allArticles = validArticles;
            displayGameResults(); // Affiche les résultats
          });
      } else {
        gameResults.innerHTML = '<p> No result !</p>';
      }
    })
    .catch(error => {
      console.error('API request error !', error);
      gameResults.innerHTML = '<p> Problem while searching... </p>';
    });
  
  // Afficher les résultats
  const displayGameResults = () => {
    const start = (currentPage - 1) * gamesPerPage;
    const end = start + gamesPerPage;
    const currentArticles = allArticles.slice(0, end); // Jeux à afficher sur la page courante
    const resultsContent = currentArticles.map((article) => {
      const platformNames = article.parent_platforms.map(platform => platform.platform.name).join(', '); // Récupère le nom de chaque plateforme et les joint avec une virgule
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
      checkShowMoreButtonVisibility(); // Vérifie la visibilité du bouton après chaque affichage
      attachCardClickEvent(); // Attache l'événement de clic à chaque carte de jeu
    } else {
      console.error("Error: gameResults is not defined or could not be found.");
    }
  };

  // Click bouton Show more
  showMoreButton.addEventListener('click', () => {
    currentPage++;
    displayGameResults(); // Réaffiche les résultats avec la nouvelle page
  });

  // Fonction pour vérifier la visibilité du bouton "Show more"
  const checkShowMoreButtonVisibility = () => {
    if (currentPage >= 4) { // Masque le bouton après 2 clics
      showMoreButton.classList.add('hide');
    } else {
      showMoreButton.classList.remove('hide');
    }
  };

  // Attache un gestionnaire d'événements à chaque carte de jeu
  const attachCardClickEvent = () => {
    const cardGames = document.querySelectorAll('.cardGame');
    cardGames.forEach(card => {
      card.addEventListener('click', () => {
        const gameId = card.getAttribute('data-gameid'); // Récupère l'ID du jeu à partir de l'attribut data-gameid
        window.location.href = `#pagedetails/${gameId}`; // Redirige vers la page de détails avec l'ID du jeu
      });
    });
  };
};

// Gestion de la soumission du formulaire de recherche
searchInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Empêche le formulaire de se soumettre et recharge la page
    const searchWord = searchInput.value.trim();

    if (!searchWord) {
      alert('Write something before submit !');
      return;
    }

    currentPage = 1; // Réinitialise la page courante à 1 à chaque nouvelle recherche
    allArticles = []; // Réinitialise la liste des articles à chaque nouvelle recherche
    handleSearch(searchWord); // Appel à la fonction de recherche
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
      handleSearch(''); // Afficher tous les jeux au chargement de la page
    } else {
      console.error("Error: gameResults is not defined or could not be found.");
    }
  };

  render();
};

PageList();













