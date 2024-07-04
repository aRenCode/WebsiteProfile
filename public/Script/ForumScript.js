

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
const closeFindUser = document.querySelector('.icon-close-find-user')
const sendBtn = document.getElementById('sendMessage')
const messageInput = document.querySelector('.messageInput')
const usernameInputFilter = document.querySelector('.nameInput')
const limitBtn = document.getElementById('limBtn')
const fromBtn = document.getElementById('fromBtn')
const dtStartBtn = document.getElementById('dateStart')
const dtEndBtn = document.getElementById('dateEnd')
const findUserBtn = document.getElementById('applyUsername')
const findUser = document.querySelector('.findUser')




let pages = 1
let pageNum = 1
let pageLim = 20
let fromUser;
let dateStart;
let dateEnd;



async function loadMessages(messages){

    if (messages.status === 'success'){

        const data = messages.texts

        data.forEach((element) => {
            const div = document.createElement('div')
            div.classList.add('item')

            const aName = document.createElement('a')
            let text = document.createTextNode(element.username.toString())
            aName.appendChild(text)
            aName.classList.add('user')
            

            const aMessage = document.createElement('a')
            text = document.createTextNode(": " + element.msg)
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

document.addEventListener('click', async (e) =>
    {
        
        var element = e.target
        //console.log(element.classList)
        if (element.className === "page"){
            
            //console.log(element.innerHTML)
            dropBtn.innerHTML = 'Page: ' + element.innerHTML
            pageNum = Number(element.innerHTML)

        } else if(element.className === "limit"){
            //console.log(element.innerHTML)
            limitBtn.innerHTML = 'Limit: ' + element.innerHTML
            pageLim = Number(element.innerHTML)
        } else{

        }
    })

dropBtn.addEventListener('click', () =>{
    
    
    pagesValidate()


})

fromBtn.addEventListener('click', ()=>{
    findUser.classList.add('active')
})

closeFindUser.addEventListener('click', ()=>{
    findUser.classList.remove('active')
})

findUserBtn.addEventListener('click', ()=>{
    fromUser = usernameInputFilter.value
    fromBtn.innerHTML = 'From ' + fromUser 
    findUser.classList.remove('active')

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

        const res = await send.json()
        if (res.status === "success"){
            const div = document.createElement('div')
            div.classList.add('item')

            const aName = document.createElement('a')
            let text = document.createTextNode(loginBtn.innerHTML.toString())
            aName.appendChild(text)
            aName.classList.add('user')
            

            const aMessage = document.createElement('a')
            text = document.createTextNode(": " + input)
            aMessage.appendChild(text)
            aMessage.classList.add('message')

            div.appendChild(aName)
            div.appendChild(aMessage)
            forumBox.appendChild(div)
        } else{

        }
        
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

