// Variables

const urlApi = "http://localhost:5678/api/"; // URL de l'API pour récupérer les données
const gallery = document.querySelector(".gallery"); // Élément HTML où seront affichés les projets

// Boutons pour filtrer les projets par catégorie
const allButton = document.getElementById("allButton"); // Bouton pour afficher tous les projets
const objectsButton = document.getElementById("objectsButton"); // Bouton pour afficher les objets
const appartmentsButton = document.getElementById("appartmentsButton"); // Bouton pour afficher les appartements
const hotelsButton = document.getElementById("hotelsButton"); // Bouton pour afficher les hôtels

// Jeton d'authentification récupéré depuis le stockage local du navigateur
const bearerAuth = window.localStorage.getItem("BearerAuth");

// Création de deux tableaux pour stocker les données des projets et des catégories
// Ces tableaux permettent de manipuler les données sans refaire de requêtes à l'API
let data = []; // Tableau pour stocker les projets
let categories = []; // Tableau pour stocker les catégories

// Requête GET pour obtenir la liste des projets dans le portfolio
fetch(urlApi + "works")
  // Vérification de la réponse de l'API et gestion des erreurs de connexion
  .then((response) => {
    if (!response.ok) {
      console.log("Erreur lors de la demande"); // Affiche un message d'erreur si la réponse n'est pas OK
    }
    return response.json(); // Conversion de la réponse en JSON
  })
  // Traitement des données reçues de l'API et stockage dans le tableau data
  .then((dataApi) => {
    data = dataApi; // Stockage des projets dans le tableau data

    updateFilter("all"); // Affiche tous les projets en utilisant le filtre "all"
    displayImagesInModal(data); // Affiche les projets dans la modale
  })
  // Gestion des erreurs éventuelles lors de la requête
  .catch((error) => {
    console.error("Erreur :", error); // Affiche l'erreur dans la console
  });

// Requête GET pour obtenir la liste des catégories
fetch(urlApi + "categories")
  .then((response) => {
    if (!response.ok) {
      console.log("Erreur lors de la demande"); // Affiche un message d'erreur si la réponse n'est pas OK
    }
    return response.json(); // Conversion de la réponse en JSON
  })
  // Traitement des données de catégories reçues de l'API et stockage dans le tableau categories
  .then((categoriesApi) => {
    categories = categoriesApi; // Stockage des catégories dans le tableau categories
    displayCategoriesInModal(categories); // Affiche les catégories dans la modale
  })
  // Gestion des erreurs éventuelles lors de la requête
  .catch((error) => {
    console.error("Erreur :", error); // Affiche l'erreur dans la console
  });

// Fonction pour mettre à jour le filtre en fonction de la catégorie sélectionnée
function updateFilter(category) {
  // Vider la galerie avant d'y ajouter les nouveaux éléments correspondant au filtre
  gallery.innerHTML = "";

  // Parcourt chaque projet dans data et l'affiche s'il correspond au filtre sélectionné
  data.forEach((work) => {
    // Si la catégorie est "all", affiche tous les projets, sinon seulement ceux avec la bonne categoryId
    if (category === "all" || work.categoryId === category) {
      const figure = document.createElement("figure"); // Crée un élément <figure> pour chaque projet
      figure.setAttribute("data-id", work.id); // Ajoute un attribut data-id pour identifier le projet

      // HTML du projet : image et titre
      figure.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}"/>
                <figcaption>${work.title}</figcaption>
            `;

      // Ajoute le projet à la galerie
      gallery.appendChild(figure);
    }
  });
}

// Met à jour le filtre en fonction du bouton cliqué

// Affiche tous les projets lorsque le bouton "all" est cliqué
allButton.addEventListener("click", () => {
  updateFilter("all");
});

// Affiche uniquement les projets de la catégorie "objets" lorsque le bouton correspondant est cliqué
objectsButton.addEventListener("click", () => {
  updateFilter(1); // La catégorie "objets" a l'id 1
});

// Affiche uniquement les projets de la catégorie "appartements" lorsque le bouton correspondant est cliqué
appartmentsButton.addEventListener("click", () => {
  updateFilter(2); // La catégorie "appartements" a l'id 2
});

// Affiche uniquement les projets de la catégorie "hôtels" lorsque le bouton correspondant est cliqué
hotelsButton.addEventListener("click", () => {
  updateFilter(3); // La catégorie "hôtels" a l'id 3
});
