// Sélectionne tous les éléments avec la classe "closeModal" (boutons pour fermer la modale)
const closeModal = document.querySelectorAll(".closeModal");

// Récupère les éléments modaux pour les manipulations d'affichage
const modal = document.getElementById("modal");
const addModal = document.getElementById("modal2");

// Sélectionne le bouton "back" pour revenir à la modale précédente
const backModal = document.querySelector(".back-button");

// Sélectionne des éléments spécifiques du DOM pour manipulation de formulaire
const selectCategory = document.getElementById("categorie");
const submitForm = document.getElementById("submit-form");
const submitLabel = document.getElementById("submit-label");
const submitText = document.getElementById("submit-text");

// Boutons d'ajout et de soumission de la modale
const addButton = document.getElementById("addButton");
const submitModalButton = document.getElementById("submitModalButton");

// Sélectionne l'élément d'entrée de fichier et l'image d'aperçu pour validation avant l'envoi
const fileInput = document.getElementById("fileInput");
const imagePreview = document.querySelector(".submit-file img");

// Utilisation de !! pour garantir un booléen (true si utilisateur connecté, false sinon)
const utilisateurConnecte = !!window.localStorage.getItem("bearerAuth");

// Extrait le token utilisateur stocké (si l'utilisateur est connecté)
const usableToken = JSON.parse(window.localStorage.getItem("bearerAuth")).token;

// Fonction pour réinitialiser l'aperçu de l'image dans le formulaire de soumission
function resetImg() {
  submitLabel.classList.remove("hidden");
  submitText.classList.remove("hidden");
  imagePreview.classList.remove("submit-img");
  imagePreview.src = "./assets/icons/img-icon.svg";
}

// Fonction pour afficher la première modale avec accessibilité
function showFirstModal() {
  modal.showModal();
  modal.style.display = "flex";
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
}

// Fonction pour masquer la première modale
function hideFirstModal() {
  modal.close();
  modal.style.display = "none";
  modal.setAttribute("aria-modal", "false");
}

// Fonction pour afficher la modale de soumission
function showSubmitModal() {
  addModal.showModal();
  addModal.style.display = "flex";
  addModal.removeAttribute("aria-hidden");
  addModal.setAttribute("aria-modal", "true");
}

// Fonction pour masquer la modale de soumission
function hideSubmitModal() {
  addModal.close();
  addModal.style.display = "none";
  addModal.setAttribute("aria-modal", "false");
}

// Vérification de connexion : si l'utilisateur est connecté, certaines options sont activées
if (utilisateurConnecte) {
  // Sélection des éléments spécifiques pour l'utilisateur connecté
  const editButtonContainer = document.getElementById("edit-button-container");
  const filters = document.querySelector(".filters-container");
  const navLog = document.getElementById("nav-log");

  // Changer le texte du lien de connexion en 'logout'
  navLog.innerText = "logout";
  navLog.href = "#";

  // Efface le token de connexion lors de la déconnexion
  navLog.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "./index.html";
  });

  // Masque les filtres pour les utilisateurs connectés
  filters.classList.add("filter-hidden");

  // Création et ajout d'un bouton d'édition
  const editButton = document.createElement("button");
  editButton.classList.add("edition");
  editButton.innerHTML = `<img src="./assets/icons/edit.svg"> Mode édition`;
  editButtonContainer.appendChild(editButton);

  // Bouton de modification de la galerie
  const galleryModify = document.getElementById("gallery-modify");
  const modificationGallery = document.createElement("button");
  modificationGallery.classList.add("gallery-modify-button");
  modificationGallery.innerHTML =
    '<img src="./assets/icons/modify.png" alt="modification button"> modifier';
  galleryModify.appendChild(modificationGallery);

  // Ouverture de la modale lors de clics sur les boutons
  modificationGallery.addEventListener("click", () => {
    showFirstModal();
  });
  editButton.addEventListener("click", () => {
    showFirstModal();
  });
  addButton.addEventListener("click", () => {
    hideFirstModal();
    showSubmitModal();
  });

  // Fermeture de la modale au clic sur les boutons de fermeture
  closeModal.forEach((button) => {
    button.addEventListener("click", () => {
      hideFirstModal();
      hideSubmitModal();
    });
  });

  // Retour vers la première modale avec réinitialisation de l'aperçu d'image
  backModal.addEventListener("click", () => {
    showFirstModal();
    hideSubmitModal();
    submitForm.reset();
    resetImg();
  });

  // Gestion des clics en dehors de la modale pour la fermer
  window.addEventListener("click", (event) => {
    if (event.target === modal || event.target === addModal) {
      hideFirstModal();
      hideSubmitModal();
      resetImg();
      submitForm.reset();
    }
  });

  // Fermeture des modales avec la touche "Échap"
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideFirstModal();
      hideSubmitModal();
      resetImg();
      submitForm.reset();
    }
  });
} else {
  editButton.classList.add("hidden"); // Cache les options d'édition si non connecté
}

// Affiche les images dans la modale en créant dynamiquement des éléments pour chaque projet
function displayImagesInModal(data) {
  const modalPictures = document.querySelector(".modal-pictures");

  data.forEach((work) => {
    const workContainer = document.createElement("div");
    workContainer.id = work.id;
    workContainer.classList.add("modal-work");
    modalPictures.appendChild(workContainer);
    const workSpot = `<img src="${work.imageUrl}" alt="${work.title}">`;
    const trashButton = `<button type="button" data-id="${work.id}" class="trash-button"><img class="trash-img" src="./assets/icons/trash.svg"></button>`;
    workContainer.innerHTML = workSpot + trashButton;

    // Ajoute l'événement de suppression pour chaque image
    const trashButtonElement = workContainer.querySelector(".trash-button");
    trashButtonElement.onclick = function () {
      deleteImage(work.id);
    };
  });
}

// Affiche les catégories dans la modale en ajoutant des options au menu déroulant
function displayCategoriesInModal(categories) {
  categories.forEach((category) => {
    const categoryOption = document.createElement("option");
    categoryOption.classList.add("submit-option");
    categoryOption.value = category.id;
    categoryOption.innerText = category.name;
    selectCategory.appendChild(categoryOption);
  });
}

// Gestion de l'aperçu et validation de fichier lors de l'ajout d'images
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
    if (file.size <= 4 * 1024 * 1024) {
      // 4 Mo en octets
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
        imagePreview.classList.add("submit-img");
        submitLabel.classList.add("hidden");
        submitText.classList.add("hidden");
      };
      reader.readAsDataURL(file);
    } else {
      alert(`L'image est trop volumineuse. Elle ne doit pas dépasser 4 Mo.`);
      fileInput.value = "";
    }
  } else {
    alert(`L'image doit être en .jpg ou .png.`);
    fileInput.value = "";
  }
});

// Active ou désactive le bouton de soumission en fonction de la validité du formulaire
submitForm.addEventListener("input", () => {
  const isFormValid = submitForm.checkValidity();
  submitModalButton.disabled = !isFormValid;
});

// Fonction pour envoyer un nouveau projet en POST et l'ajouter dynamiquement
submitForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("titre").value;
  const categoryId = document.getElementById("categorie").value;
  const picture = fileInput.files[0];

  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", categoryId);
  formData.append("image", picture);

  fetch(urlApi + "works", {
    method: "POST",
    headers: { Authorization: `Bearer ${usableToken}` },
    body: formData,
  })
    .then((response) => (response.ok ? response.json() : Promise.reject()))
    .then((newWorkData) => {
      if (newWorkData) {
        data.push(newWorkData);

        const modalPictures = document.querySelector(".modal-pictures");
        const workContainer = document.createElement("div");
        workContainer.id = newWorkData.id;
        workContainer.classList.add("modal-work");
        workContainer.innerHTML =
          `<img src="${newWorkData.imageUrl}" alt="${newWorkData.title}">` +
          `<button type="button" data-id="${newWorkData.id}" class="trash-button"><img class="trash-img" src="./assets/icons/trash.svg"></button>`;

        const trashButtonElement = workContainer.querySelector(".trash-button");
        trashButtonElement.onclick = () => deleteImage(newWorkData.id);
        modalPictures.appendChild(workContainer);
      }
      submitForm.reset();
      resetImg();
      hideSubmitModal();
    })
    .catch((error) => {
      console.error("Erreur lors de l'envoi de l'image", error);
      alert(
        "Erreur lors de l'ajout du projet. Veuillez vérifier vos informations."
      );
    });
});
