//display an mùodify the layout for the modal screen
let inputAll = document.querySelectorAll(".projectsMod");
let loginTxt = document.getElementById('loginId');

function hideModal () {
for (let i = 0; i < inputAll.length; i++){
    let modalDisplay = inputAll[i]
    modalDisplay.style = "display:none"

if (localStorage.token){
    modalDisplay.style = "display:visible"
    let catMod = document.querySelector(".categories").style = "display:none"

    loginTxt.innerHTML = "logout"
    loginTxt.href = './index.html'
    loginTxt.addEventListener("click", event =>{
    localStorage.removeItem("token")
    })
} else {
    modalDisplay.style = "display:none"
    loginTxt.innerHTML = "login"
}

}};
hideModal();

// get the gallery class 
let gallery = document.querySelector(".gallery");

//create selectable categories 
let categories = document.querySelector(".categories");
let categoriesSelected = document.querySelector(".categories selected");

const galleryCat = [
    {
		"id":"tot", "name":"Tout"
	},
    {
		"id":"obj", "name":"Objets"
	},
    {
        "id":"app", "name":"Appartments"
    },
    {
        "id":"hot", "name":"Hôtels & restaurants"
    }
]

for (let g = 0; g < galleryCat.length; g++){

    let selectionCat = document.createElement("div");
    selectionCat.classList.add('categoriesTab');
    selectionCat.id = galleryCat[g].id
    selectionCat.innerText = galleryCat[g].name

    categories.append(selectionCat)
}

let categoriesTab = document.querySelectorAll(".categoriesTab");

// fetch data
async function worksData() {
    try {
    const res = await fetch('http://localhost:5678/api/works')
    let data = await res.json();

    //create elements using the fetched data
    for (let i = 0; i < data.length; i++) {
        let newFigure = document.createElement("figure");
        newFigure.classList.add('main-content')
        newFigure.setAttribute('categoryId', data[i].categoryId);
        gallery.append(newFigure)   

        //create image with attributes
        let dataImg = document.createElement("img");
        dataImg.setAttribute('alt', data[i].title);
        dataImg.setAttribute('title', data[i].title);
        dataImg.src = data[i].imageUrl;
        dataImg.id = data[i].id;
        
        //create captation and content
        let figCap = document.createElement("figcaption");
        let figCapData = document.createElement("figcaptionData").innerHTML = data[i].title;

        //append all that
        newFigure.append(dataImg)
        newFigure.append(figCap)
        figCap.append(figCapData)
    }
} catch (error){
        console.error(error);
}};
//call function
worksData();

//main selecteur
function removeClass () {
    let categoriesTab = document.querySelectorAll(".categoriesTab");

    for (let g = 0; g < categoriesTab.length; g++){
        let catid = categoriesTab[g].id
    
        categoriesTab.forEach((categoriesTab) => {
            categoriesTab.classList.remove('selected')
        })
    }
}

let totSelect = document.querySelector("#tot");
let objSelect = document.querySelector("#obj");
let appSelect = document.querySelector("#app");
let hotSelect = document.querySelector("#hot");

totSelect.classList.add('selected')
totSelect.addEventListener('click', () => {
    removeClass();
    totCat();
});

// select all figure with category

let categorySelector = document.querySelector('.categories')
//assign each category id to a specific class

function totCat(){
    let allCat = document.querySelectorAll('figure[categoryId]')
// pour chaque figure, vérifier l'attribut categoryId et la comparée avec une valeur
for (let i = 0; i < allCat.length; i++){
    let allCatId = allCat.item(i).getAttribute("categoryId");
//let pour ajouter un attribut et changer le display
    let modifAttribut = allCat.item(i);
    let cTab = categoriesTab[i];
//condition pour changer le display
    totSelect.classList.add('selected')
    modifAttribut.setAttribute('style', 'display:block');
}};

objSelect.addEventListener('click', () => {
    removeClass();
    objCat();
});

let cat = document.querySelectorAll('figure[categoryId="1"]')
function objCat (){
    let allCat = document.querySelectorAll('figure[categoryId]')
    let cat = document.querySelectorAll('figure[categoryId="1"]')
    
// pour chaque figure, vérifier l'attribut categoryId et la comparée avec une valeur
for (let i = 0; i < allCat.length; i++){
    let catId = cat.item(1).getAttribute("categoryId");
    let allCatId = allCat.item(i).getAttribute("categoryId");

//let pour ajouter un attribut et changer le display
    let modifAttribut = allCat.item(i);

//condition pour changer le display
    if (catId === allCatId) {

    objSelect.classList.add('selected')
    modifAttribut.setAttribute('style', 'display:block');
} else {
    modifAttribut.setAttribute('style', 'display:none');
}}};

appSelect.addEventListener('click', () => {
    removeClass();
    appCat();
});
function appCat (){
    let allCat = document.querySelectorAll('figure[categoryId]')
    let cat = document.querySelectorAll('figure[categoryId="2"]')

for (let i = 0; i < allCat.length; i++){
    let catId = cat.item(1).getAttribute("categoryId");
    let allCatId = allCat.item(i).getAttribute("categoryId");
    let cTab = categoriesTab[i];

    let modifAttribut = allCat.item(i);

    if (catId === allCatId) {
    appSelect.classList.add('selected')
    modifAttribut.setAttribute('style', 'display:block');
} else {
    modifAttribut.setAttribute('style', 'display:none');
}}};

hotSelect.addEventListener('click', () => {
    removeClass();
    hotCat();
});

function hotCat(){
    let allCat = document.querySelectorAll('figure[categoryId]')
    let cat = document.querySelectorAll('figure[categoryId="3"]')
    
for (let i = 0; i < allCat.length; i++){
    let catId = cat.item(1).getAttribute("categoryId");
    let allCatId = allCat.item(i).getAttribute("categoryId");
    let cTab = categoriesTab[i];

    let modifAttribut = allCat.item(i);

    if (catId === allCatId) {
    hotSelect.classList.add('selected')
    modifAttribut.setAttribute('style', 'display:block');
} else {
    modifAttribut.setAttribute('style', 'display:none');
}}
}

// recharge the gallery when closing the modal
let form  = document.querySelector('.close')

form.addEventListener('click', async event  =>{
    event.preventDefault()
    let allMainImg = document.querySelectorAll('.main-content')

    for (var i = 0; i < allMainImg.length; i++){

    let mainImgRemover = allMainImg[i]

    mainImgRemover.remove()
    }
    worksData()
})