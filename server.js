const express = require('express')
const path = require('path')
const port = 9999
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Schema = mongoose.Schema;
const forumRoute = require('./public/Backend/forum')
const newUser = require('./public/model/model')

let Username = "Login"

const app = express()

//app.use(express.static('Views'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/Views')));
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())

app.use('/forum', forumRoute)

mongoose.connect('mongodb+srv://pryvya:test123@aren.a04dm6v.mongodb.net/Users')



//GETTERS SETTERS PORTS

app.listen(9999, () =>{
    console.log(`Server up at: ${port}`)
})



app.get('/info/:dynamic', (req, res)=>
{
    const { dynamic } = req.params
    //console.log('test: ' + dynamic)
    res.status(200).json({info: 'preset text'})
});

app.get('/logIn', (req, res)=>
    {
        console.log('Tst')
    });

app.post('/register', async (req, res) =>{
    const {parcel} = req.body

    if(!parcel){
        return res.status(400).send({status:'failed'})
    }


    if(await newUser.exists({email: parcel.Email}) || await newUser.exists( {username: parcel.Username})){
       // || newUser.exists( {username: parcel.Username})
        console.log("Username or email already exists")
        res.status(200).send({status:'Already exists'})
    } else{

    

    let NewUser = new newUser({
        username: parcel.Username,
        email: parcel.Email,
        pass: parcel.Pass
    })


    await NewUser.save()
    res.status(200).send({status:'Created'})

}

   
   
})

let username = "Anonymous"


app.post('/loginCreds', async (req, res) =>{
    const {params} = req.body
    
    
    try{
        
    const user = await newUser.findOne({email: params.email, pass: params.pass})

    if (user){
        Username = user.username
        return res.status(200).send({status:'success', username: user.username})

    } else{
        
        return res.status(200).send({status:'failed'})
    }
    } catch{
        return res.status(400).send({status:'failed, server side problem'})
    }
})

app.get('/getUsername', (req, res) => {
    return res.status(200).send({username:Username})
})



