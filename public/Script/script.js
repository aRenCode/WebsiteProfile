const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup')
const iconClose = document.querySelector('.icon-close')

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

    const baseUrl = 'http://localhost:9999/'





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



    const result = await fetch(baseUrl + "info/check",{
        method:'GET'
        
    })






    //console.log(result)
    const data = await result.json()
    //username.value = data.info
}


async function logIn(event){
    event.preventDefault()
    const baseUrl = 'http://localhost:9999/'

    const result = await fetch(baseUrl + "logIn",{
        method:'GET'
        
    })
}




