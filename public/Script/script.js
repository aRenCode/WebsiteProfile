const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup')
const iconClose = document.querySelector('.icon-close')
const popup = document.querySelector('.popup')
const popupClose = document.querySelector('.icon-close-popup')
let popupMsg = document.getElementById('popupTxt')


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

    const baseUrl = 'http://localhost:9999/'




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
    }

    }


    /*
    const result = await fetch(baseUrl + "info/check",{
        method:'GET'
        
    })*/






    //console.log(result)
    //const data = await result.json()
    //username.value = data.info
}


async function logIn(event){
    event.preventDefault()
    const baseUrl = 'http://localhost:9999/'
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
    } else {
        console.log('No user found!')
        popup.classList.add('active')
        popupMsg.innerHTML = "Email or username don't exist"
        
    }
}
}




//CHeck for existence






