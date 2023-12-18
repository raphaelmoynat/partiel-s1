let baseUrl = "https://partiel-b1dev.imatrythis.com/api/"
let token = ""
let content = document.querySelector('.content')
let userName = ""

registerForm() //retourne le formulaire d'inscription
function run(){
    if (token==null){
        return loginForm()
    }
    else{
        console.log("réussi")
    }
}
function renderContent(pageContent){
    content.innerHTML=""
    content.innerHTML = pageContent
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