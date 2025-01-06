const loginForm = document.querySelector("form"); // Sélection du formulaire de connexion dans le document HTML

// Ajout d'un écouteur d'événement pour la soumission du formulaire de connexion
loginForm.addEventListener("submit", async function (event) {
  // Empêche le comportement par défaut de l'envoi du formulaire pour permettre un contrôle via JavaScript
  event.preventDefault();

  // Supprime tout message d'erreur précédent, le cas échéant
  const previousError = document.querySelector(".error");
  if (previousError) {
    previousError.remove(); // Suppression de l'élément d'erreur si présent
  }

  // Récupération des valeurs d'email et de mot de passe saisies par l'utilisateur dans le formulaire
  const loginFormDatas = {
    email: event.target.querySelector("[name=email]").value, // Récupère la valeur de l'input email
    password: event.target.querySelector("[name=password]").value, // Récupère la valeur de l'input password
  };

  // Transformation des données de connexion en une chaîne JSON pour l'envoyer dans la requête
  const loginData = JSON.stringify(loginFormDatas);

  // Envoi des informations de connexion via une requête POST à l'API
  await fetch("http://localhost:5678/api/users/login", {
    method: "POST", // Méthode HTTP utilisée pour l'envoi des données
    headers: {
      "Content-Type": "application/json", // Indique que les données envoyées sont au format JSON
    },
    body: loginData, // Ajout des données de connexion dans le corps de la requête
  })
    // Gestion de la réponse de l'API
    .then((response) => {
      if (response.ok === true) {
        return response.json(); // Retourne les données si la requête est réussie
      } else {
        // Si la réponse est 404 ou 401, déclenche une erreur avec un message
        throw new Error(`Erreur dans l’identifiant ou le mot de passe.`);
      }
    })

    // Traitement des données de réponse lorsque l'authentification est réussie
    .then((body) => {
      // Stocke le token dans le stockage local pour une utilisation future
      window.localStorage.setItem("bearerAuth", JSON.stringify(body));

      // Redirige l'utilisateur vers la page d'accueil et l'ancre spécifique
      window.location.replace("index.html#edit-button-container");
    })

    // Gestion des erreurs lors de l'authentification
    .catch((e) => {
      // Crée un élément div pour afficher le message d'erreur
      const error = document.createElement("div");
      error.classList.add("form-error"); // Ajoute une classe pour styliser l'erreur
      error.innerHTML = e.message; // Insère le message d'erreur dans le div
      // Ajoute le message d'erreur après le dernier élément enfant du formulaire
      document.querySelector("form").append(error);
    });
});
