const PageDetails = (argument) => {
  const preparePage = () => {
    const cleanedArgument = argument.trim().replace(/\s+/g, "-");

    const displayGame = (gameData, trailerData, screenData, storesData) => {
      const {
        name,
        background_image,
        released,
        description,
        developers,
        tags,
        genres,
        publishers,
        parent_platforms,
        website,
        rating,
        ratings_count,
        screenshots,
        stores,
        trailers
      } = gameData;
    
      const articleDOM = document.querySelector(".page-detail .article");
      articleDOM.querySelector("h1.title").innerHTML = name;

      if (background_image) {
        articleDOM.querySelector(".background-image").src = background_image;
      }
   
      if (released) {
        articleDOM.querySelector("p.release-date span").innerHTML = released;
      }
    
      if (description) {
        articleDOM.querySelector("p.description").innerHTML = description;
      }
    
      // Développeurs
      if (developers && developers.length > 0) {
        const developersList = developers.map(developer => `<a class="internal-link" href="/developers/${developer.slug}">${developer.name}</a>`).join(", ");
        articleDOM.querySelector(".developers").innerHTML = `${developersList}`;
      }
    
      // Tags
      if (tags && tags.length > 0) {
        const tagsList = tags.map(tag => `<a class="internal-link" href="/tags/${tag.slug}">${tag.name}</a>`).join(", ");
        articleDOM.querySelector(".tags").innerHTML = `${tagsList}`;
      }
    
      // Genres
      if (genres && genres.length > 0) {
        const genresList = genres.map(genre => `<a class="internal-link" href="/genres/${genre.slug}">${genre.name}</a>`).join(", ");
        articleDOM.querySelector(".genres").innerHTML = `${genresList}`;
      }
    
      // Éditeurs
      if (publishers && publishers.length > 0) {
        const publishersList = publishers.map(publisher => `<a class="internal-link" href="/publishers/${publisher.slug}">${publisher.name}</a>`).join(", ");
        articleDOM.querySelector(".publishers").innerHTML = `${publishersList}`;
      }
    
      // Plateformes
      if (parent_platforms && parent_platforms.length > 0) {
        const platformNames = parent_platforms.map(platform => platform.platform.name).join(', ');
        articleDOM.querySelector(".platforms span").innerHTML = platformNames;
      } 

      // Site Web
      if (website) {
        articleDOM.querySelector(".website").innerHTML = `<a href="${website}">Check Website</a>`;
      }
    
      // Notes
      if (rating && ratings_count) {
        articleDOM.querySelector(".ratings").innerHTML = `${rating}/5 - (${ratings_count} ratings)`;
      }
    
      // Captures d'écran
      if (screenData.results.length > 0) {
        const screenshotsHTML = screenData.results.slice(0, 4).map(screenshot => `<img src="${screenshot.image}" alt="Screenshot">`).join("");
        articleDOM.querySelector(".screenshots").innerHTML = screenshotsHTML;
      }

      //Stores
      if (storesData.results.length > 0) {
        const storesList = storesData.results.map(store => `<a class="store-link" href="${store.url}">${store.id}</a>`).join('');
        articleDOM.querySelector(".stores").innerHTML = storesList;
      }



      // Trailers
      if (trailerData.results.length > 0) {
        const trailer = trailerData.results[0].data.max;
        articleDOM.querySelector(".trailers").innerHTML = `<iframe width="560" height="315" src="${trailer}" frameborder="0" allowfullscreen></iframe>`;
      }
    };

    const fetchGame = (url, argument) => {
      fetch(`${url}/${argument}?key=${API_KEY}`)
        .then((response) => response.json())
        .then((responseData) => {
          fetchGameTrailer(url, argument, responseData);
        });
    };

    const fetchGameTrailer = (url, argument, responseData) => {
      fetch(`${url}/${argument}/movies?key=${API_KEY}`)
        .then((response) => response.json())
        .then((trailerData) => {
          fetchGameScreenshot(url, argument, responseData, trailerData);
        });
    };

    const fetchGameScreenshot = (url, argument, responseData, trailerData) => {
      fetch(`${url}/${argument}/screenshots?key=${API_KEY}`)
          .then((response) => response.json())
          .then((screenData) => {
              fetchGameStores(url, argument, responseData, trailerData, screenData);
          });
  };

  const fetchGameStores = (url, argument, responseData, trailerData, screenData) => {
      fetch(`${url}/${argument}/stores?key=${API_KEY}`)
          .then((response) => response.json())
          .then((storesData) => {
              displayGame(responseData, trailerData, screenData, storesData);
          });
  };

    fetchGame('https://api.rawg.io/api/games', cleanedArgument);

    // Vider le contenu des cartes de jeu
    const gameResults = document.getElementById('gameResults');
    if (gameResults) {
      gameResults.innerHTML = '';
    } else {
      console.error("Error: gameResults is not defined or could not be found.");
    }
  };

  
  const render = () => {
    const pageContent = document.getElementById('pageContent');
    if (pageContent) {
      pageContent.innerHTML = `
        <section class="page-detail">
          <div class="article">
          <div class="pic">
            <img src="" class="background-image">
            <button class="website"></button>
          </div>
            <div class="header">
              <h1 class="title"></h1>
              <p class="ratings"></p>
            </div>
            <div id="plot-details>
              <p class="plot">Plot</p>
              <p class="description"></p>
            </div>
            <div id="first">
              <div class="position-details">
                <p class="mini-details">Released date</p>
                <p class="release-date"><span></span></p>
              </div>
              <div class="position-details">
                <p class="mini-details">Developers</p>
                <p class="developers"></p>
              </div>
              <div class="position-details">
                <p class="mini-details">Platforms</p>
                <p class="platforms"><span></span></p>
              </div>
              <div class="position-details">
                <p class="mini-details">Publishers</p>
                <p class="publishers"></p>
              </div>
              <div class="position-details">
                <p class="mini-details">Genres</p>
                <p class="genres"></p>
              </div>
            </div>
            <div id="second">
              <p class="mini-details">Tags</p>
              <p class="tags"></p>
            </div>
            <h1 class="name-details">TRAILER</h1>
            <div class="trailers"> No trailer, sorry... <span></span></div>
            <h1 class="name-details">BUY</h1>
            <p class="stores"></p>
            <h1 class="name-details">SCREENSHOTS</h1>
            <div class="screenshots"></div>
            <h1 class="name-details">YOUTUBE</h1>
            <h1 class="name-details">SIMILAR GAMES</h1>
          </div>
        </section>
      `;

      preparePage();

      // Supprimer le bouton showMore de la page PageDetails
      const showMoreButton = document.getElementById('showMoreButton');
      if (showMoreButton) {
        showMoreButton.remove();
      }

      // Supprimer les cartes (gameResults) de la page PageDetails
      const gameResults = document.getElementById('gameResults');
      if (gameResults) {
        gameResults.remove();
      } else {
        console.error("Error: gameResults is not defined or could not be found.");
      }
    } else {
      console.error("Error: pageContent is not defined or could not be found.");
    }
  };

  render();
};


