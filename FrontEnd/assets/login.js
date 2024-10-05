let submitted = document.querySelector('form');

submitted.addEventListener('submit', async function (e){
    e.preventDefault();
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    let emailVal = email.value
    let passVal = password.value
    
        let userVal = {
            "email" : emailVal,
            "password" : passVal
        } 
        userValjSON = JSON.stringify(userVal)
    try {
        let response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: userValjSON
        })
        
        //store token
        let result = await response.json()

        if (response.status != 200) {
        document.querySelector(".errorMsg").innerHTML = 'Erreur dans l’identifiant ou le mot de passe';
        } else {
            localStorage.setItem("token", result.token)
            window.location.href = './index.html'
        }
        } catch (error) {
        console.error("Error:", error);
    }
})