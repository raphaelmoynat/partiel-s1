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
        <div>
            <button class="btn btn-danger suppr" type="submit">Tout Supprimer</button>
            <button class="btn btn-success refresh" type="submit">Rafraichir</button>
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
        <div class="d-flex justify-content-center my-5">
        <div class="card" style="width: 18rem;">
            <img src="${produit.picture}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${produit.name}</h5>
                <p class="card-text">${produit.description}</p>
                <p class="card-text">statut : ${statut}</p>
                <button class="btn btn-primary statut" id="${produit.id}" >Changer statut</button>
                <button class="btn btn-primary delete" id="${produit.id}" >Supprimer</button>
                <button class="btn btn-primary addImage" id="${produit.id}" >Ajouter Image</button>
            
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
    refreshButton()
    deleteAllBtn()
    addImageBtn()

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
                            <div class="row">
                                <input type="text mb-2" placeholder="nom" class=" border border-success fs-5" id="nameProduit">
                                <input type="text mb-2" placeholder="description" class=" border border-success fs-5" id="descriptionProduit">
                                <button type="button" class="btn btn-success fs-5" id="ajouterProduit">Ajouter</button>
                            
                            </div>`
    content.innerHTML+=formMessage

    btnPost= document.querySelector('#ajouterProduit')
    btnPost.addEventListener('click', ()=>{
        addProduit()


    })
}

async function addProduit(){
    const name = document.querySelector('#nameProduit')
    const description = document.querySelector('#descriptionProduit')


    let corpsMessage = {
        name : name.value,
        description : description.value
    }

    const messageParams = {
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        method : "POST",
        body :  JSON.stringify(corpsMessage)
    }

    return await fetch(`${baseUrl}mylist/new`, messageParams)
        .then(response => response.json())
        .then(data=>{
            console.log(data)
            run()
        })

}

function refreshButton() {
    const refreshButton = document.querySelectorAll('.refresh')
    refreshButton.forEach((button) => {
        button.addEventListener('click', () => {
            console.log("coucou")
            run()
        })
    })
}

function deleteAllBtn(){
    const deleteAllButton = document.querySelectorAll('.suppr')
    deleteAllButton.forEach((button) => {
        button.addEventListener('click', () => {
            console.log("coucou")
            fetchDeleteAll()
        })
    })
}

async function fetchDeleteAll(){
    const params = {
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        method : "DELETE"
    }


    return await fetch(`${baseUrl}mylist/clear`, params)
        .then(response=>response.json())
        .then(data=>{
            console.log(data)
            console.log('supprimer tout')
            run()
        })
}

function addImageBtn(){
    const addImageButton = document.querySelectorAll('.addImage')
    addImageButton.forEach((button) => {
        button.addEventListener('click', () => {
            const idProduit = button.id
            addImageForm(idProduit)
        })
    })

}

function addImageForm(idProduit){
    let addImageTemplate = `
 
              <div class="mb-3">
                <label  class="form-label">Ajouter image</label>
                <input class="form-control" type="file" id="picture">
              </div>
              <button type="submit" class="btn btn-primary submitImage">Submit</button>

    `

    renderContent(addImageTemplate)
    const imageInput = document.querySelector('#picture')
    imageInput.addEventListener('change', () => {
        // Mettez à jour l'aperçu de l'image si nécessaire
        // Vous pouvez ajouter du code pour afficher l'aperçu de l'image ici si nécessaire
    })

    const submitImage = document.querySelector('.submitImage')
    submitImage.addEventListener('click', ()=>{

        const imageFile = imageInput.files[0]
        console.log(imageFile)
        fetchAddImage(idProduit, imageFile)
    })
}

async function fetchAddImage(idProduit, imageFile){
    const formData = new FormData();
    formData.append('itempic', imageFile);


    const params = {
        headers : {"Authorization":`Bearer ${token}`,
            },
        method : "POST",
        body: formData,
    }

    return await fetch(`${baseUrl}mylist/addpicturetoitem/${idProduit}`, params)
        .then(response=>response.json())
        .then(data=>{
            console.log(data)
            console.log('supprimer tout')
            run()
        })

}


