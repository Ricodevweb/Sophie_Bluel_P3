// Sélection des éléments nécessaires pour gérer les modales et les formulaires
const closeModal = document.querySelectorAll(".closeModal");
const modal = document.getElementById("modal");
const addModal = document.getElementById("modal2");
const backModal = document.querySelector(".back-button");
const selectCategory = document.getElementById("categorie");
const submitForm = document.getElementById("submit-form");
const submitLabel = document.getElementById("submit-label");
const submitText = document.getElementById("submit-text");
const addButton = document.getElementById("addButton");
const submitModalButton = document.getElementById("submitModalButton");
const fileInput = document.getElementById("fileInput");
const imagePreview = document.querySelector(".submit-file img");

// Vérifie si l'utilisateur est connecté
const utilisateurConnecte = !!window.localStorage.getItem("bearerAuth");
const usableToken = utilisateurConnecte
  ? JSON.parse(window.localStorage.getItem("bearerAuth")).token
  : null;

let editButton;

// Fonction pour réinitialiser l'aperçu de l'image dans le formulaire
function resetImg() {
  submitLabel.classList.remove("hidden");
  submitText.classList.remove("hidden");
  imagePreview.classList.remove("submit-img");
  imagePreview.src = "./assets/icons/img-icon.svg";
}

// Fonction pour afficher la première modale
function showFirstModal() {
  modal.showModal();
  modal.style.display = "flex";
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
  addModal.setAttribute("aria-modal", "true");
}

// Fonction pour masquer la modale de soumission
function hideSubmitModal() {
  addModal.close();
  addModal.style.display = "none";
  addModal.setAttribute("aria-modal", "false");
}

// Si l'utilisateur est connecté, on affiche les options d'édition
if (utilisateurConnecte) {
  const editButtonContainer = document.getElementById("edit-button-container");
  const filters = document.querySelector(".filters-container");
  const navLog = document.getElementById("nav-log");
  const galleryModify = document.getElementById("gallery-modify");

  navLog.innerText = "logout";
  navLog.href = "#";
  navLog.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "./index.html";
  });
  filters.classList.add("filter-hidden");

  // Création et ajout du bouton d'édition
  editButton = document.createElement("button");
  editButton.classList.add("edition");
  editButton.innerHTML = `<img src="./assets/icons/edit.svg"> Mode édition`;
  editButtonContainer.appendChild(editButton);

  // Ajout du bouton de modification à la galerie
  const modificationGallery = document.createElement("button");
  modificationGallery.classList.add("gallery-modify-button");
  modificationGallery.innerHTML =
    '<img src="./assets/icons/modify.png" alt="modification button"> modifier';
  galleryModify.appendChild(modificationGallery);

  // Gestion des événements pour les boutons d'édition et de modification
  modificationGallery.addEventListener("click", () => showFirstModal());
  editButton.addEventListener("click", () => showFirstModal());
  addButton.addEventListener("click", () => {
    hideFirstModal();
    showSubmitModal();
  });

  closeModal.forEach((button) =>
    button.addEventListener("click", () => {
      hideFirstModal();
      hideSubmitModal();
    })
  );

  backModal.addEventListener("click", () => {
    showFirstModal();
    hideSubmitModal();
    submitForm.reset();
    resetImg();
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal || event.target === addModal) {
      hideFirstModal();
      hideSubmitModal();
      resetImg();
      submitForm.reset();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideFirstModal();
      hideSubmitModal();
      resetImg();
      submitForm.reset();
    }
  });
} else {
  // Si l'utilisateur n'est pas connecté, on masque le bouton d'édition
  editButton = null;
}

// Fonction pour afficher les images dans la modale en créant des éléments pour chaque projet
function displayImagesInModal(data) {
  const modalPictures = document.querySelector(".modal-pictures");
  data.forEach((work) => {
    const workContainer = document.createElement("div");
    workContainer.id = work.id;
    workContainer.classList.add("modal-work");
    workContainer.innerHTML =
      `<img src="${work.imageUrl}" alt="${work.title}">` +
      `<button type="button" data-id="${work.id}" class="trash-button"><img class="trash-img" src="./assets/icons/trash.svg"></button>`;
    modalPictures.appendChild(workContainer);

    const trashButtonElement = workContainer.querySelector(".trash-button");
    trashButtonElement.onclick = function () {
      deleteImage(work.id);
    };
  });
}

// Fonction pour afficher les catégories dans la modale en ajoutant des options au menu déroulant
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
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.classList.add("submit-img");
        submitLabel.classList.add("hidden");
        submitText.classList.add("hidden");
      };
      reader.readAsDataURL(file);
    } else {
      alert("L'image est trop volumineuse. Elle ne doit pas dépasser 4 Mo.");
      fileInput.value = "";
    }
  } else {
    alert("L'image doit être en .jpg ou .png.");
    fileInput.value = "";
  }
});

// Active le bouton de soumission si le formulaire est valide
submitForm.addEventListener("input", () => {
  submitModalButton.disabled = !submitForm.checkValidity();
});

// Envoie du projet en POST, ajout à la galerie et réinitialisation du formulaire
submitForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("titre").value;
  const categoryId = selectCategory.value;
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
        // Met à jour la galerie après ajout du nouveau projet
        updateFilter("all");
        displayImagesInModal([newWorkData]);
        submitForm.reset();
        resetImg();
        hideSubmitModal();
      }
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout du projet :", error);
      alert("Erreur lors de l'ajout du projet. Veuillez réessayer.");
    });
});

// Fonction pour supprimer une image par ID et la retirer du DOM
function deleteImage(workId) {
  const workContainer = document.getElementById(workId);
  const workFigure = document.querySelector(`figure[data-id="${workId}"]`);
  fetch(urlApi + `works/${workId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${usableToken}` },
  })
    .then((response) => {
      if (response.status === 204) {
        workContainer.remove();
        workFigure.remove();
      } else {
        console.error("Erreur lors de la suppression de l'image : " + workId);
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression de l'image : " + error);
    });
}
