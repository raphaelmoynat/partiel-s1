let baseUrl = "https://partiel-b1dev.imatrythis.com/api/"
let token = null
let content = document.querySelector('.content')
let navbar = document.querySelector('.navbar')
let userName = ""


registerForm() //retourne le formulaire d'inscription
function run(){
    if (token==null){
        return loginForm()
    }
    else{
        console.log("réussi")
        fetchListeCourses()

    }
}
function renderContent(pageContent){
    navbar.innerHTML=""
    content.innerHTML=""
    if (token!=null){
        navbar.innerHTML += `<div class="container-fluid">
        <a class="navbar-brand" href="#">Page de ${userName}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarScroll">
            <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Link
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Action</a></li>
                        <li><a class="dropdown-item" href="#">Another action</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link disabled" aria-disabled="true">Link</a>
                </li>
            </ul>
            <form class="d-flex" role="search">
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success" type="submit">Search</button>
            </form>
        </div>
    </div>`

    }
    content.innerHTML += pageContent
} //renvoie le contenu de la page
function registerForm(){

    let templateRegister = `              
          <div class="mt-5">
            <div class="mb-3"><h3>S'inscrire</h3></div>
            <label  class="form-label">Pseudo</label>
            <input type="text" class="form-control" id="usernameRegister">
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="text" class="form-control" id="passwordRegister">
          </div>
          <button type="submit" class="btn btn-primary mb-3" id="btnRegister">S'inscrire </button>  
          <br>
          <a type="submit" class="btn btn-link" id="linkLogin">Vous avez déjà un compte ? Se connecter</a>
    `

    renderContent(templateRegister)
    const linkLogin = document.querySelector('#linkLogin')
    linkLogin.addEventListener('click', ()=>{
        loginForm()
    })

    const registerBtn = document.querySelector('#btnRegister')
    registerBtn.addEventListener('click', ()=>{
        fetchRegister()
        console.log('coucou')
    })
}
async function fetchRegister(){

    let corpsRegister = {
        username : document.querySelector('#usernameRegister').value,
        password : document.querySelector('#passwordRegister').value
    }

    let params = {
        method : 'POST',
        headers : {"Content-type":"application/json"},
        body : JSON.stringify(corpsRegister)
    }

    return await fetch(`${baseUrl}register`, params)
        .then(response=>response.json())
        .then(data=>{
            if(data === "username already taken"){
                console.log('déja pris')
                alert('username déjà pris, veuillez réessayer')
                return registerForm()
            }else{
                return loginForm()
            }
        })
}
function loginForm(){
    let templateLogin = `              
          <div class="mt-5">
          <div class="mb-3"><h3>Se connecter</h3></div>
            <label class="form-label">Pseudo</label>
            <input type="text" class="form-control" id="username">
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" id="password">
          </div>
          <button type="submit" class="btn btn-primary" id="btnLogin">Se connecter</button> 
          <br>
          <a type="submit" class="btn btn-link" id="linkRegister">Vous n'avez pas de compte ? S'inscrire</a>                
    `

    renderContent(templateLogin)

    const linkRegister = document.querySelector('#linkRegister')
    linkRegister.addEventListener('click', ()=>{
        registerForm()
    })

    const loginBtn = document.querySelector('#btnLogin')
    loginBtn.addEventListener('click', ()=>{
        fetchLogin()
        console.log('coucou')
    })
}
async function fetchLogin(){

    let corpsLogin = {
        username : document.querySelector('#username').value,
        password : document.querySelector('#password').value
    }

    let params = {
        method : 'POST',
        headers : {"Content-type":"application/json"},
        body : JSON.stringify(corpsLogin)
    }

    return await fetch(`${baseUrl}login`, params)
        .then(response=>response.json())
        .then(data=>{
            if(data.message === "Invalid credentials." ){
                return loginForm()
            }else{
                token=data.token
                userName = username.value
                console.log(userName)
                run()
            }
        })
}

function renderProfile(profil) {
    let buttonWatchList = ""

    let templateProfile = `
        <div class="d-flex justify-content-center mt-5">
        <div class="card" style="width: 18rem;">
            <img src="${profil.avatar}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${profil.username}</h5>
                <p class="card-text">id : ${profil.id}</p>
                <button class="btn btn-primary watch" >Voir ma liste</button>
            </div>
        </div>
        </div>
    
    `
    renderContent(templateProfile)

    buttonWatchList = document.querySelector('.watch')
    buttonWatchList.addEventListener('click', ()=>{
        fetchListeCourses()
    })



}

async function fetchProfil(){
    const params = {
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        method : "GET"
    }


    return await fetch(`${baseUrl}whoami`, params)
        .then(response=>response.json())
        .then(data=>{
            return data
            userName = data.username
        })

}

function generateProduit(produit){


    let statut = ""
    if (produit.status == false){
        statut = "en attente"
    }
    else{
        statut = "acheté"
    }

    let templateProduit = `
        <div class="d-flex justify-content-center mt-5">
        <div class="card" style="width: 18rem;">
            <img src="${produit.picture}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${produit.name}</h5>
                <p class="card-text">${produit.description}</p>
                <p class="card-text">statut : ${statut}</p>
                <button class="btn btn-primary statut" id="${produit.id}" >Changer statut</button>
                <button class="btn btn-primary delete" id="${produit.id}" >Supprimer</button>
                
            </div>
        </div>
        </div>
    
    `
    return templateProduit

}

function renderListeCourses(produits){
    let contentList = ""
    produits.forEach(produit=>{
        contentList += generateProduit(produit)
    })
    renderContent(contentList)
    createFormProduit()
    switchButton()
    deleteButton()

}

async function fetchListeCourses(){
    const params = {
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        method : "GET"
    }


    return await fetch(`${baseUrl}mylist`, params)
        .then(response=>response.json())
        .then(data=>{
            renderListeCourses(data)


        })

}

function switchButton() {
    const switchButtons = document.querySelectorAll('.statut')
    switchButtons.forEach((button) => {
        button.addEventListener('click', () => {
            console.log("coucou")
            const idProduit = button.id
            switchStatus(idProduit)

        })
    })
}

async function switchStatus(idProduit){
    const params = {
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        method : "PATCH"
    }


    return await fetch(`${baseUrl}mylist/switchstatus/${idProduit}`, params)
        .then(response=>response.json())
        .then(data=>{
            console.log(data)
            console.log('réussi')
           run()
        })

}

function deleteButton() {
    const deleteButtons = document.querySelectorAll('.delete')
    deleteButtons.forEach((button) => {
        button.addEventListener('click', () => {
            console.log("coucou")
            const idProduit = button.id
            fetchDelete(idProduit)

        })
    })
}


async function fetchDelete(idProduit){
    const params = {
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        method : "DELETE"
    }


    return await fetch(`${baseUrl}mylist/delete/${idProduit}`, params)
        .then(response=>response.json())
        .then(data=>{
            console.log(data)
            console.log('supprimer')
            run()
        })

}

function createFormProduit(){
    let btnPost =""

    let formMessage = `
                            <div class="row fx-down formAjout">
                                <input type="text mb-2" placeholder="nom" class=" border border-success fs-5" id="nameProduit">
                                <input type="text mb-2" placeholder="description" class=" border border-success fs-5" id="descriptionProduit">
                                <button type="button" class="btn btn-success fs-5" id="ajouterProduit">Ajouter</button>
                            
                            </div>`
    content.innerHTML+=formMessage

    btnPost= document.querySelector('#ajouterProduit')
    btnPost.addEventListener('click', ()=>{



    })
}


