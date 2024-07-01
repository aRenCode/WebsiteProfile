


const postBtn = document.querySelector('.messageBtn')
const closePopupError = document.querySelector('.icon-close-popup')
const popupError = document.querySelector('.popup-error')
const baseUrl = 'http://localhost:9999/'
const loginBtn = document.querySelector('.btnLogin-popup')
const messageForm = document.querySelector('.messageForm')
const closeMessage = document.querySelector('.icon-close-message')
const sendBtn = document.getElementById('sendMessage')
const messageInput = document.querySelector('.messageInput')


closePopupError.addEventListener('click', ()=>{
    popupError.classList.remove('active')

})

closeMessage.addEventListener('click', ()=>{
    messageForm.classList.remove('active')

})

postBtn.addEventListener('click', ()=>{
    if(loginBtn.innerHTML === 'Login'){
        popupError.classList.add('active')
    } else {
        messageForm.classList.add('active')

    }

})

sendBtn.addEventListener('click', async ()=>{

    if (messageInput === ""){

    } else{
        messageForm.classList.remove('active')
        const input = messageInput.value

        const send = await fetch(baseUrl + "forum/addMessage", {
            method: 'POST',
            headers:{
                "Content-Type":'application/json'
            },
            body: JSON.stringify({
                parcel:{
                Username: loginBtn.innerHTML,
                Date: new Date(),
                Message: input
                }
            })
        })
        
    }
})

window.addEventListener('load', async () =>{
    console.log('Loaded')
    const changes = await fetch(baseUrl + 'getUsername', {
        method:'GET'
    })

    const result = await changes.json()
    console.log(result.username)
    loginBtn.innerHTML = result.username


})
