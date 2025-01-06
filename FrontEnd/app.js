// URL de base de l'API pour récupérer les données
let urlApi = "http://localhost:5678/api/";

// Sélection de la galerie HTML où seront affichés les projets
const gallery = document.querySelector(".gallery");

// Conteneur des boutons de filtre
const filterContainer = document.querySelector(".filters-container");

// Récupération du jeton d'authentification depuis le stockage local du navigateur
let bearerAuth = window.localStorage.getItem("BearerAuth");

// Tableaux pour stocker temporairement les projets et les catégories reçus de l'API
let data = []; // Pour stocker les projets
let categories = []; // Pour stocker les catégories

// Fonction pour récupérer les catégories depuis l'API
function fetchCategories() {
  return fetch(urlApi + "categories")
    .then((response) => {
      if (!response.ok) {
        console.error("Erreur lors de la demande des catégories");
        throw new Error("Erreur de récupération des catégories");
      }
      return response.json();
    })
    .then((categoriesApi) => {
      categories = categoriesApi; // Stocke les catégories dans la variable globale `categories`
      createFilterButtons(); // Appel de la fonction pour créer les boutons après avoir récupéré les catégories
      displayCategoriesInModal(categories); // Appel pour afficher les catégories dans la modal
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des catégories :", error);
    });
}

// Fonction pour créer les boutons de filtre dynamiquement
function createFilterButtons() {
  // Crée un bouton "Tous" pour afficher tous les projets
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("filter");
  allButton.setAttribute("id", "all");
  filterContainer.appendChild(allButton);

  // Pour chaque catégorie, créer un bouton de filtre correspondant
  categories.forEach((category) => {
    const categoryButton = document.createElement("button");
    categoryButton.classList.add("filter");
    categoryButton.textContent = category.name;
    categoryButton.setAttribute("data-category-id", category.id); // Attribut data pour stocker l'ID de catégorie
    filterContainer.appendChild(categoryButton);
  });
}

// Fonction pour récupérer et afficher les projets
function fetchProjects() {
  fetch(urlApi + "works")
    .then((response) => {
      if (!response.ok) {
        console.log("Erreur lors de la demande des projets");
        throw new Error("Erreur de récupération des projets");
      }
      return response.json();
    })
    .then((dataApi) => {
      data = dataApi; // Stockage des projets dans la variable data
      updateFilter("all"); // Affichage initial de tous les projets
      displayImagesInModal(data); // Affiche les projets dans la modale (fonction à définir ailleurs)
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des projets :", error);
    });
}

// Fonction pour mettre à jour l'affichage des projets en fonction de la catégorie sélectionnée
function updateFilter(category) {
  // Vider la galerie avant d'y ajouter les projets correspondant au filtre sélectionné
  gallery.innerHTML = "";

  // Parcourir chaque projet et l'afficher s'il correspond à la catégorie sélectionnée
  data.forEach((work) => {
    if (category === "all" || work.categoryId === category) {
      const figure = document.createElement("figure"); // Élément <figure> pour chaque projet
      figure.setAttribute("data-id", work.id); // Ajout de l'ID du projet

      // Structure HTML du projet avec image et titre
      figure.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}"/>
                <figcaption>${work.title}</figcaption>
            `;

      // Ajoute l'élément projet dans la galerie
      gallery.appendChild(figure);
    }
  });
}

// Délégation d'événements pour gérer les clics sur les boutons de filtre
filterContainer.addEventListener("click", (event) => {
  const button = event.target;

  // Vérifie si l'élément cliqué est un bouton de filtre
  if (button.classList.contains("filter")) {
    const categoryId = button.getAttribute("data-category-id");

    // Si un ID de catégorie est défini, le convertir en nombre pour la fonction, sinon utiliser "all"
    updateFilter(categoryId ? parseInt(categoryId) : "all");
  }
});

// Appel des fonctions pour charger les catégories et les projets lors de l'initialisation
fetchCategories(); // Récupère les catégories, crée les boutons de filtre et affiche les catégories dans la modal
fetchProjects(); // Récupère les projets et les affiche dans la galerie
