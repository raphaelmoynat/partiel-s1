let baseUrl = "https://partiel-b1dev.imatrythis.com/api/"
let token = null
let content = document.querySelector('.content') //contenu de la page
let navbar = document.querySelector('.navbar')
let userName = ""


registerForm() //retourne le formulaire d'inscription
function run(){ //rafraichit le contenu de la page
    if (token==null){
        return loginForm()
    }
    else{
        console.log("réussi")
        fetchListeCourses()

    }
}
function renderContent(pageContent){ //renvoie le contenu correspondant
    navbar.innerHTML=""
    content.innerHTML=""
    if (token!=null){
        navbar.innerHTML += `<div class="container-fluid">
        <a class="btn navbar-brand showProfile" href="#">Page de ${userName}</a>
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
} //renvoie le formulaire d'insciption
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
} //renvoie le formulaire d'insciption
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

function renderProfile(profil) { //renvoie le profil utilisateur
    let buttonWatchList = ""

    let templateProfile = `
        <div class="d-flex justify-content-center my-5">
        <div class="card" style="width: 18rem;">
            <img src="${profil.avatar}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${profil.username}</h5>
                <p class="card-text">id : ${profil.id}</p>
                <button class="btn btn-primary watch" >Voir ma liste</button>
            </div>
        </div>
        </div>
        
         <div class="mb-3">
                <label  class="form-label">Ajouter avatar</label>
                <input class="form-control" type="file" id="avatar">
         </div>
         <button type="submit" class="btn btn-primary submitAvatar">Submit</button>
    
    `
    renderContent(templateProfile)

    addAvatarBtn()

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
            renderProfile(data)
        })

}

function buttonRenderProfile(){
    const btnShowProfile= document.querySelector('.showProfile')
    btnShowProfile.addEventListener('click', ()=>{
        fetchProfil()
    })
}

function generateProduit(produit){ //renvoie une fiche de produit


    let statut = ""
    if (produit.status == false){
        statut = "en attente"
    }
    else{
        statut = "acheté"
    }

    let templateProduit = `
        
                <div class='col-md-4 d-flex justify-content-center align-items-center'>
                <div class="card mb-3" style="width: 18rem;">
                    <img src="${produit.picture}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${produit.name}</h5>
                        <p class="card-text">${produit.description}</p>
                        <p class="card-text">statut : ${statut}</p>
                        <div class="d-flex flex-column justify-content-center">
                            <button class="btn btn-primary  statut m-1" id="${produit.id}" >Changer statut</button>
                            <button class="btn btn-danger delete m-1" id="${produit.id}" >Supprimer</button>
                            <button class="btn btn-secondary addImage m-1" id="${produit.id}" >Ajouter Image</button>
                            <button class="btn btn-warning modify m-1" id="${produit.id}" >Modifier</button>
                        </div>                   
                    </div>
                </div>
                </div>
             
    
    `
    return templateProduit

}

function renderListeCourses(produits){
    let contentList = `<div class="row mt-3">`
    produits.forEach(produit=>{
        contentList += generateProduit(produit)
    })
    contentList += `</div>`
    renderContent(contentList)
    createFormProduit()
    switchButton()
    deleteButton()
    refreshButton()
    deleteAllBtn()
    addImageBtn()
    buttonRenderProfile()
    modifyBtn()

}//renvoie la liste de toutes les courses

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
            fetchSwitchStatus(idProduit)

        })
    })
}

async function fetchSwitchStatus(idProduit){
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
        fetchAddProduit()


    })
} //formulaire pour ajouter un produit

async function fetchAddProduit(){
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


    const submitImage = document.querySelector('.submitImage')
    submitImage.addEventListener('click', ()=>{

        const imageFile = imageInput.files[0]
        console.log(imageFile)
        fetchAddImage(idProduit, imageFile)
    })
} //renvoie le formulaire pour ajouter une image au produit

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

function addAvatarBtn(){
    const avatarInput = document.querySelector('#avatar')


    const submitAvatar = document.querySelector('.submitAvatar')
    submitAvatar.addEventListener('click', ()=>{

        const avatarFile = avatarInput.files[0]

        fetchAddAvatar(avatarFile)
    })

}



async function fetchAddAvatar(avatarFile){
    const formData = new FormData();
    formData.append('profilepic', avatarFile);


    const params = {
        headers : {"Authorization":`Bearer ${token}`,
        },
        method : "POST",
        body: formData,
    }

    return await fetch(`${baseUrl}profilepicture`, params)
        .then(response=>response.json())
        .then(data=>{
            console.log(data)
            fetchProfil()
        })

}

function modifyBtn(){
    const modifyButton = document.querySelectorAll('.modify')
    modifyButton.forEach((button) => {
        button.addEventListener('click', () => {
            const idProduit = button.id
            modifyForm(idProduit)
        })
    })

}

function modifyForm(idProduit){
    let addImageTemplate = `
 
              <div class="mb-3">
                <label  class="form-label">Nom</label>
                <input class="form-control" type="text" id="modifyName">
                <label  class="form-label">Description</label>
                <input class="form-control" type="text" id="modifyDescription">
                <label  class="form-label">Status</label>
                <input placeholder="acheté ou en attente" class="form-control" type="text" id="modifyStatus">
              </div>
              <button type="submit" class="btn btn-primary submitModify">Submit</button>

    `

    renderContent(addImageTemplate)





    const submitModify = document.querySelector('.submitModify')
    submitModify.addEventListener('click', ()=>{
        const modifyNameInput = document.querySelector('#modifyName').value
        const modifyDescriptionInput = document.querySelector('#modifyDescription').value
        const modifyStatusInput = document.querySelector('#modifyStatus').value

        let statut = null

        if (modifyStatusInput== "acheté"){
            statut = true
        }else if(modifyStatusInput== "en attente"){
            statut = false
        }

        fetchModify(idProduit, modifyNameInput, modifyDescriptionInput, statut)
    })
}//renvoie le formulaire pour modifier un produit

async function fetchModify(idProduit, modifyNameInput, modifyDescriptionInput, statut){
    let content = {
        name : modifyNameInput,
        description: modifyDescriptionInput,
        status : statut,
    }


    const params = {
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        method : "PUT",
        body: JSON.stringify(content),
    }

    return await fetch(`${baseUrl}mylist/edit/${idProduit}`, params)
        .then(response=>response.json())
        .then(data=>{
            console.log(data)
            run()
        })

}


