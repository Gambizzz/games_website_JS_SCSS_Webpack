const searchGamesByDeveloper = (developerSlug) => {
  // Nettoyage du slug du développeur
  const cleanedSlug = developerSlug.trim().replace(/\s+/g, "-");

  // Fonction pour récupérer les jeux associés au développeur
  const fetchDeveloperGames = (developerSlug) => {
    fetch(`https://api.rawg.io/api/games?developers=${developerSlug}&key=${API_KEY}`)
      .then((response) => response.json())
      .then((gamesData) => {
        // Afficher les jeux associés au développeur
        displayDeveloperGames(gamesData);
      })
      .catch((error) => {
        console.error("Error fetching developer games:", error);
      });
  };

  // Fonction pour afficher les jeux associés au développeur
  const displayDeveloperGames = (gamesData) => {
    // Afficher les jeux dans la section de résultats de jeux
    const gameResults = document.getElementById('gameResults');
    if (gameResults) {
      gameResults.innerHTML = ''; // Vider d'abord le contenu existant
      gamesData.results.forEach(game => {
        // Créer un élément de jeu et l'ajouter à la liste des résultats de jeux
        const gameElement = document.createElement('div');
        gameElement.classList.add('game-item');
        gameElement.innerHTML = `
          <h2>${game.name}</h2>
          <p>${game.description}</p>
          <!-- Ajoutez d'autres détails du jeu selon vos besoins -->
        `;
        gameResults.appendChild(gameElement);
      });
    } else {
      console.error("Error: gameResults is not defined or could not be found.");
    }
  };

  // Appel initial pour récupérer les jeux associés au développeur
  fetchDeveloperGames(cleanedSlug);
};


// Ajoutez cet événement de clic à votre code existant qui génère les liens des développeurs
articleDOM.querySelector(".developers").addEventListener("click", function(event) {
  // Empêcher le comportement par défaut du lien
  event.preventDefault();

  // Vérifier si l'élément cliqué est un lien
  if (event.target.tagName === "A") {
    // Récupérer le slug du développeur à partir de l'attribut href du lien
    const developerSlug = event.target.getAttribute("href").split("/").pop();

    // Appeler la fonction pour rechercher les jeux associés au développeur
    searchGamesByDeveloper(developerSlug);
  }
}); 
