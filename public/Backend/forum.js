const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
//const Schema = require('../model/model');

const router = express.Router()
let lastMessageDate;
let pageLim = 20
let lastId = 0;
let pageNum = 1

mongoose.connect('mongodb+srv://pryvya:test123@aren.a04dm6v.mongodb.net/Users')

var Schema = mongoose.Schema;

const regSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    msg: {
        type: String,
        required: true
    }
});

const newMessage = mongoose.model('Messages', regSchema)

db = mongoose.connection




console.log('Check123')

router.post('/addMessage', async (req, res)=>
    {

        lastId = await newMessage.find().sort({ date: -1}).limit(1)
        lastId = lastId[0].id

        const {parcel} = req.body

        let send = newMessage({
            id: lastId+1,
            username:parcel.Username,
            date: parcel.Date,
            msg: parcel.Message
        })

        
        try{
            await send.save()
            res.status(200).send({status:"success"})
        } catch{
            res.status(400).send({status:"failed to send"})
        }
        lastId++;
    });

router.get('/getPages', async (req, res) =>{
    const checkPages = await newMessage.countDocuments()
    
    if (checkPages){
        res.status(200).send({status:"success", number: Math.floor(checkPages / pageLim)+1, limit: pageLim})
    } else{
        res.status(400).send({status:"failed"})
    }
})

router.get('/getLast', async (req, res) => {

    //get last id 
    lastId = await newMessage.find().sort({ id: -1}).limit(1)

    lastId = lastId[0].id



    const data = await newMessage.find().sort({ id: 1}).limit(pageLim);

    //getInfoForServer
    lastMessageDate = data[data.length-1].date

    if (data){
        res.status(200).send({status: 'success', texts: data})
    } else{
        res.status(400).send({status: 'failed'})
    }
})

router.get('/newMessages', async (req, res) => {
    const data = await newMessage.find({id: { $gt: lastId }});
    
    if (data){
        res.status(200).send({status: 'success', texts: data})
    } else{
        res.status(400).send({status: 'failed'})
    }

    lastId = await newMessage.find().sort({ id: -1}).limit(1)
    lastId = lastId[0].id

})

module.exports = router;