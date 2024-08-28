

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
const colorChangeForm = document.querySelector('.colorChange')
const closeChangeColor = document.querySelector('.icon-close-change-color')
const colorChosen = document.getElementById('colorPicker')
const colorCheckbox = document.getElementById('allTexts')
const applyColor = document.getElementById('applyColor')
const dtStartBtn = document.getElementById('dateStart')
const dtEndBtn = document.getElementById('dateEnd')
const clearFltrBtn = document.getElementById('clearBtn')
const searchBtn = document.getElementById('searchBtn')
const addBtn = document.getElementById('addBtn')
const findUserBtn = document.getElementById('applyUsername')
const resetBtn = document.getElementById('resetBtn')
const findUser = document.querySelector('.findUser')
const h2FindUser = document.getElementById('h2User')
const forumNewHeader = document.querySelector('.forumNewHeader')





let pages = 1
let pageNum = 1
let pageLim = 20
let fromUser = '.*';
let dateStart = '0001-01-01';
let dateEnd = '9999-12-31';
let filtersChanged = false
let numberOfMessages = 0
let colorValue = "#5F9EA0"
const months = [  "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"]
let messageId = 0


async function loadThread(){

    clearForumBox()

    let countpages = await fetch(baseUrl + 'forum/getPages', {
        methdod:'GET'
    })

    countpages = await countpages.json()
    if(countpages.status ==="success"){
        pages = countpages.number
        pagesValidate()

    } else{
        console.log('Error')
    }

    //GETTING THE LAST DEFAULT NUMBER(20) OF MESSAGES IN

    let messages = await fetch(baseUrl+ 'forum/getLast', {
        method:'GET'
    })


  
    messages = await messages.json()

    numberOfMessages = messages.texts.length

    
    loadMessages(messages)


    //pages

    pagesValidate()
}

function isValidDate(dateInput){
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    
    // Check if the date string matches the regex
    if (!regex.test(dateInput)) {
        return false;
    } else{
        if(new Date(dateInput) == 'Invalid Date'){
            return false
        }

        return true
    }
}



async function loadMessages(messages){

    if (messages.status === 'success'){

        if(messages.texts.length != 0){
        const data = messages.texts

        data.forEach((element) => {
            const div = document.createElement('div')
            div.classList.add('item')

            const aDate = document.createElement('a')
            
            let date = new Date(element.date)
            //console.log(date)
            let dateFormatted = document.createTextNode(`     (${date.getDate()} ${months[date.getMonth()]} ${date.getHours()}:${date.getMinutes()})`)
            aDate.appendChild(dateFormatted)
            aDate.classList.add('time')

            const aName = document.createElement('a')
            aName.style.color = element.color
            let text = document.createTextNode(element.username.toString())
            aName.appendChild(text)
            aName.classList.add('user')
            

            const aMessage = document.createElement('a')
            text = document.createTextNode(": " + element.msg)
            aMessage.appendChild(text)
            aMessage.classList.add('message')

            div.appendChild(aName)
            div.appendChild(aMessage)
            div.appendChild(aDate)
            forumBox.appendChild(div)

        

        })

    }else{
        
    }

    } else{
        console.log("Something went wrong 0_o")
    }
}

function checkForFilterChange(){
    return pageNum == dropBtn.innerHTML.substring(5)  && pageLim == limitBtn.innerHTML.substring(6) &&
    fromUser == fromBtn.innerHTML.substring(5)

}

function showThreads(threads){

    threads.forEach((element) =>{
        const div = document.createElement('div')
            div.classList.add('item')

            const aName = document.createElement('a')
            let text = document.createTextNode(element.name)
            aName.appendChild(text)
            aName.classList.add('user')
            



            div.appendChild(aName)
            forumBox.appendChild(div)
    })
}

function pagesValidate(){

    pages = pagesDropdown.childElementCount
    const children = numberOfMessages





    while(Math.ceil(children / pageLim) > pages){
        pages++;
        const a = document.createElement('a')
        const textNode = document.createTextNode(pages.toString())
        a.classList.add('page')
        a.appendChild(textNode)
        
        

        pagesDropdown.appendChild(a)

 
        
    }



    let temp = Math.ceil(numberOfMessages/pageLim)


    while(pages > temp){
        pages--;
        
        pagesDropdown.removeChild(pagesDropdown.lastElementChild)

        
    }







}

function clearForumBox(){
    forumBox.innerHTML = ''
}


document.addEventListener('click', async (e) =>
    {
        
        
        var element = e.target
      
        //console.log(element.classList)
        if (element.className === "page"){
            
            //console.log(element.innerHTML)
            
            
            dropBtn.innerHTML = 'Page: ' + element.innerHTML
            pageNum = Number(element.innerHTML)
            filtersChanged = true
            

        } else if(element.className === "limit"){
            //console.log(element.innerHTML)
            limitBtn.innerHTML = 'Limit: ' + element.innerHTML
            pageLim = Number(element.innerHTML)
            filtersChanged = true
            pagesValidate()
        } else if (element.className == "user" && forumNewHeader.className == "forumNewHeader activeForum"){


            const send = await fetch(baseUrl + 'forum/threadChange', {
                method: 'POST',
                headers:{
                    "Content-Type":'application/json'
                },
                body: JSON.stringify({
                    parcel:{
                        threadName: element.innerHTML
                    }
                })
            })




             forumNewHeader.classList.remove('activeForum')
           

            loadThread()
            

        } else if (element.className == "user" && forumNewHeader.className == "forumNewHeader"){

            /*
            CHANGE LATER FOR PROPER USER AUTHENTIFICATION TO CHANGE COLOR
            USING INNER HTML FOR FASTER TESTING WITHOUT PROPERLY LOGGING IN
            ----------------------------------------------------------------------------------------------------------------
            ----------------------------------------------------------------------------------------------------------------
            */ 

            if(element.innerHTML== loginBtn.innerHTML){

                
            //const tempForumBox = document.querySelector('.forumBox')

            const specificChild = element.parentElement

            const allChildren = Array.from(forumBox.children)

            messageId = ((pageNum -1) * pageLim) + allChildren.indexOf(specificChild) + 1
            colorChangeForm.classList.add('active')
            
            }
        }
    })

dropBtn.addEventListener('click', () =>{
    
    
    pagesValidate()


})

applyColor.addEventListener('click',async ()=>{
                /*
            CHANGE LATER FOR PROPER USER AUTHENTIFICATION TO CHANGE COLOR
            USING INNER HTML FOR FASTER TESTING WITHOUT PROPERLY LOGGING IN
            ----------------------------------------------------------------------------------------------------------------
            ----------------------------------------------------------------------------------------------------------------
            */ 
    if(colorCheckbox.checked){
        let res = await fetch(baseUrl + 'forum/changeAllMessagesColors',{
            method: 'POST',
            headers:{
                "Content-Type":'application/json'
            },
            body: JSON.stringify({
                info:{
                    name: loginBtn.innerHTML,
                    color: colorChosen.value.toString()

                }
            })



        })
        
    } else{
        console.log(colorChosen.value.toString())
        let res = await fetch(baseUrl + 'forum/changeMessageColor',{
            method: 'POST',
            headers:{
                "Content-Type":'application/json'
            },
            body: JSON.stringify({
                info:{
                    id: messageId,
                    color: colorChosen.value.toString()

                }
            })



        })
    }

    colorChangeForm.classList.remove('active')

    

    
})

addBtn.addEventListener('click', () =>{
        findUser.classList.add('active')
        h2FindUser.innerHTML = 'Type a Forum Name'
})

resetBtn.addEventListener('click', async() =>{

    clearForumBox()

    let allThreads = await fetch(baseUrl + "threads/getThreads", {
        method:'GET'
    })

    allThreads = await allThreads.json()

    if (allThreads.status == 'success'){

        console.log('Worked')
        showThreads(allThreads.threads)
    } else{
        console.log('Error')
    }
})

searchBtn.addEventListener('click', async () => {
        findUser.classList.add('active')
        h2FindUser.innerHTML = 'Forum Name to Find'
    
})

fromBtn.addEventListener('click', ()=>{
    findUser.classList.add('active')
        h2FindUser.innerHTML = 'Type a username'
})

dtStartBtn.addEventListener('click', ()=>{
    findUser.classList.add('active')
        h2FindUser.innerHTML = 'Start Date (YYYY-MM-DD)'
        
})
dtEndBtn.addEventListener('click', ()=>{
    findUser.classList.add('active')
    h2FindUser.innerHTML = 'End Date (YYYY-MM-DD)'
})

closeFindUser.addEventListener('click', ()=>{
    findUser.classList.remove('active')
})

closeChangeColor.addEventListener('click', ()=>{
    colorChangeForm.classList.remove('active')
})

clearFltrBtn.addEventListener('click', ()=>{
    
    pageLim = 20
    limitBtn.innerHTML = 'Limit: 20'

    pages = 1
    pageNum = 1
    dropBtn.innerHTML = 'Page: 1'

    fromUser = '.*'
    fromBtn.innerHTML = 'From'

    dateStart = '0001-01-01'
    dtStartBtn.innerHTML = 'Date Start'

    dateEnd = '9999-12-31'
    dtEndBtn.innerHTML = 'Date End'

    filtersChanged = true
    numberOfMessages = 0
})

findUserBtn.addEventListener('click', async ()=>{
    if (h2FindUser.innerHTML === "Type a username") {

    fromUser = usernameInputFilter.value
    fromBtn.innerHTML = 'From ' + fromUser 
    findUser.classList.remove('active')
    filtersChanged = true
}

    else if(h2FindUser.innerHTML === 'Start Date (YYYY-MM-DD)'){

    if(isValidDate(usernameInputFilter.value.toString())){
        dateStart = usernameInputFilter.value
    }
    findUser.classList.remove('active')
    filtersChanged = true

    } else if(h2FindUser.innerHTML === 'End Date (YYYY-MM-DD)'){

        if(isValidDate(usernameInputFilter.value.toString())){
            dateEnd = usernameInputFilter.value
        }
    findUser.classList.remove('active')
    filtersChanged = true

    } else if (h2FindUser.innerHTML === 'Type a Forum Name'){

        if(usernameInputFilter.value != ""){
            let res = await fetch(baseUrl + 'threads/addThread', {
                method: 'POST',
                headers:{
                    "Content-Type":'application/json'
                },
                body: JSON.stringify({
                    info:{
                        date: new Date(),
                        name: usernameInputFilter.value

                    }
                })
            })

        }
        findUser.classList.remove('active')
    } else if (h2FindUser.innerHTML === 'Forum Name to Find'){

        //console.log(usernameInputFilter.value)
        if(usernameInputFilter.value != ""){
            let res = await fetch(baseUrl + 'threads/findThreads', {
                method: 'POST',
                headers:{
                    "Content-Type":'application/json'
                },
                body: JSON.stringify({
                    info:{
                        name: usernameInputFilter.value.toString()

                    }
                })
            })

            res = await res.json()
            if (res.status == 'success'){

                clearForumBox()
                showThreads(res.threads)
            } else{
                console.log('Error')
            }

        }
        findUser.classList.remove('active')
    }

})


refreshBtn.addEventListener('click', async ()=>{

    //console.log(!filtersChanged)
    if (!filtersChanged){
    let res = await fetch(baseUrl + 'forum/newMessages', {
        method: 'GET'
    })

    res = await res.json()


    
    
 
    //clearForumBox()

    if(res.texts.length!=0){
        clearForumBox()
    loadMessages(res)
    pagesValidate()
    }
    else{

    }
    


} else{



    let res = await fetch(baseUrl + 'forum/newFilters', {
        method: 'POST',
        headers:{
            "Content-Type":'application/json'
        },
        body: JSON.stringify({
            filters:{
            pageNum: pageNum,
            pageLim: pageLim,
            fromUser: fromUser,
            dateStart: dateStart,
            dateEnd: dateEnd
            }
        })
    })

    filtersChanged = false

    res = await res.json()

    if (res.status === "success"){
        //forumBox.innerHTML = '';


        if(res.specificFilter == true){
            numberOfMessages = res.length
            console.log(numberOfMessages)
        }
        console.log('asdsadasd')
        clearForumBox()
        loadMessages(res)
        pagesValidate()


    }else{
        console.log("Error, can't get data from filters")
    }
}




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
                Message: input,
                color: colorValue.toString()
                }
            })
        })

        const res = await send.json()
        if (res.status === "success" && forumBox.childElementCount < pageLim){
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


    /*
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

    numberOfMessages = messages.texts.length

    
    loadMessages(messages)


    //pages

    pagesValidate()
    */


    //GET Threads
    let allThreads = await fetch(baseUrl + "threads/getThreads", {
        method:'GET'
    })

    allThreads = await allThreads.json()

    if (allThreads.status == 'success'){

        clearForumBox()
        console.log('Worked')
        showThreads(allThreads.threads)
    } else{
        console.log('Error')
    }

    //Populate the table with threads

})

