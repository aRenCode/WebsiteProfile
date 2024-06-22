const express = require('express')
const path = require('path')
const port = 9999
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Schema = mongoose.Schema;

const app = express()

//app.use(express.static('Views'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/Views')));
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())

mongoose.connect('mongodb+srv://pryvya:test123@aren.a04dm6v.mongodb.net/Users')

//DB STUFF

const regSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    }
});

const newUser = mongoose.model("Users", regSchema)

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
    }0
    res.status(200).send({status:'received'})

    let NewUser = new newUser({
        username: parcel.Username,
        email: parcel.Email,
        pass: parcel.Pass
    })
    await NewUser.save()
    console.log('Done')

   
   
})

