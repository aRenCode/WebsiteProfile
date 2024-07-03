

const forumBox = document.querySelector('.forumBox')
const postBtn = document.querySelector('.messageBtn')
const pagesDropdown = document.querySelector('.content')
const dropBtn = document.querySelector('.dropdownBtn')
const pageChoose = document.querySelector('.page')
const refreshBtn = document.getElementById('refreshBtn')
const closePopupError = document.querySelector('.icon-close-popup')
const popupError = document.querySelector('.popup-error')
const baseUrl = 'http://localhost:9999/'
const loginBtn = document.querySelector('.btnLogin-popup')
const messageForm = document.querySelector('.messageForm')
const closeMessage = document.querySelector('.icon-close-message')
const sendBtn = document.getElementById('sendMessage')
const messageInput = document.querySelector('.messageInput')
const limitBtn = document.getElementById('limBtn')
const fromBtn = document.getElementById('fromBtn')
const dtStartBtn = document.getElementById('dateStart')
const dtEndBtn = document.getElementById('dateEnd')




let pages = 1
let pageNum = 1
let pageLim = 20
let fromUser;
let dateStart;
let dateEnd;


async function loadMessages(messages){

    if (messages.status === 'success'){

        const data = messages.texts
        
        messages.texts.forEach((element) => {
            const div = document.createElement('div')
            div.classList.add('item')

            const aName = document.createElement('a')
            let text = document.createTextNode(element.username + ": ")
            aName.appendChild(text)
            aName.classList.add('user')
            

            const aMessage = document.createElement('a')
            text = document.createTextNode(element.msg)
            aMessage.appendChild(text)
            aMessage.classList.add('message')

            div.appendChild(aName)
            div.appendChild(aMessage)
            forumBox.appendChild(div)


        })

    } else{
        console.log("Something went wrong 0_o")
    }
}

function pagesValidate(){

    const children = forumBox.childElementCount

    while(Math.floor(children / pageLim)+1 > pages){
        pages++;
        const a = document.createElement('a')
        const textNode = document.createTextNode(pages.toString())
        a.appendChild(textNode)
        
        

        pagesDropdown.appendChild(a)
 
        
    }
}

document.addEventListener('click', (e) =>
    {
        
        var element = e.target
        if (element.classList === "page"){
            console.log(element.innerHTML)
        } else{
            
        }
    })

dropBtn.addEventListener('click', () =>{
    
    
    pagesValidate()


})

refreshBtn.addEventListener('click', async ()=>{
    let res = await fetch(baseUrl + 'forum/newMessages', {
        method: 'GET'
    })

    res = await res.json()

    loadMessages(res)

})



closePopupError.addEventListener('click', ()=>{
    popupError.classList.remove('active')

})

closeMessage.addEventListener('click', ()=>{
    messageForm.classList.remove('active')

})

postBtn.addEventListener('click', async ()=>{
    const checkUser = await fetch(baseUrl + 'getUsername', {
        method: 'GET'
    })
    if(loginBtn.innerHTML === 'Login' /*|| checkUser.username !=  loginBtn.innerHTML*/){
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

    loginBtn.innerHTML = result.username


    //COUNTING PAGES

    let countpages = await fetch(baseUrl + 'forum/getPages', {
        methdod:'GET'
    })

    countpages = await countpages.json()
    if(countpages.status ==="success"){
        pages = countpages.number

    } else{
        console.log('Error')
    }

    //GETTING THE LAST DEFAULT NUMBER(20) OF MESSAGES IN

    let messages = await fetch(baseUrl+ 'forum/getLast', {
        method:'GET'
    })

  
    messages = await messages.json()

    
    loadMessages(messages)


    //pages

    pagesValidate()

})

