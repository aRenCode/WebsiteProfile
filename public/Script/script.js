const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup')
const iconClose = document.querySelector('.icon-close')
const popup = document.querySelector('.popup')
const popupClose = document.querySelector('.icon-close-popup')
let popupMsg = document.getElementById('popupTxt')
const baseUrl = 'http://localhost:9999/'

let Username = "Login"

window.addEventListener('load', async () =>{
    console.log('Loaded')
    const changes = await fetch(baseUrl + 'getUsername', {
        method:'GET'
    })

    const result = await changes.json()
    console.log(result.username)
    btnPopup.innerHTML = result.username


})

registerLink.addEventListener('click', ()=>{
wrapper.classList.add('active');

});

loginLink.addEventListener('click', ()=>{

    wrapper.classList.remove('active');
    });

btnPopup.addEventListener('click', ()=>{

     wrapper.classList.add('active-popup');
 });

iconClose.addEventListener('click', ()=>{

    wrapper.classList.remove('active-popup');
});

popupClose.addEventListener('click', () => {
    popup.classList.remove('active')

})


//to server
const regBtn = document.getElementById('regBtn')
const logBtn = document.getElementById('logBtn')
regBtn.addEventListener('click', registerUser)
logBtn.addEventListener('click', logIn)


async function registerUser(event){
    event.preventDefault()
    const username = document.getElementById("username")
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const checkbox = document.getElementById("regCheck")

    




    if (email.value == null || password.value == null || !checkbox.checked || username == null){
        console.log('All fields required')
    } else{

    const send = await fetch(baseUrl + "register", {
        method: 'POST',
        headers:{
            "Content-Type":'application/json'
        },
        body: JSON.stringify({
            parcel:{
            Username: username.value,
            Email: email.value,
            Pass: password.value
            }
        })
    })




    const result = await send.json()
    if (result.status === "Already exists"){
        wrapper.classList.remove('active');
        popup.classList.add('active')
        popupMsg.innerHTML = "Username or email already exist"
    } else{
        wrapper.classList.remove('active');
        popup.classList.add('active')
        popupMsg.innerHTML = "Account created!"
    }

    }




    //const result = await fetch(baseUrl + "tests/test",{
     //   method:'GET'
        
    //})






  
    //const data = await result.json()
    //console.log(result)
    //username.value = data.info
}


async function logIn(event){
    event.preventDefault()
   
    const email = document.getElementById("logEmail")
    const password = document.getElementById("logPass")
    const checkbox = document.getElementById("lgnCheck")


    //const checkExist = await fetch()

    if (email.value == null || password.value == null || !checkbox.checked){
        console.log("All fields required")
    }else{

    const result = await fetch(baseUrl + "loginCreds", {
        method: 'POST',
        headers:{
            "Content-Type":'application/json'
        },
        body: JSON.stringify({
            params:{
            email: email.value,
            pass: password.value
            }
        })
    })

    let convertedResult = await result.json()

    if (convertedResult.status === "success"){
        console.log('User found')
        wrapper.classList.remove('active-popup');
        Username = convertedResult.username
        btnPopup.innerHTML = Username
    } else {
        console.log('No user found!')
        popup.classList.add('active')
        popupMsg.innerHTML = "Email or username don't exist"
        
    }
}
}




//CHeck for existence






