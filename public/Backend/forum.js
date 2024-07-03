const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
//const Schema = require('../model/model');

const router = express.Router()
let lastMessageDate;
let pageLim = 20



mongoose.connect('mongodb+srv://pryvya:test123@aren.a04dm6v.mongodb.net/Users')

var Schema = mongoose.Schema;

const regSchema = new Schema({
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
        const {parcel} = req.body

        let send = newMessage({
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

    
    const data = await newMessage.find().sort({ date: 1}).limit(pageLim);

    //getInfoForServer
    lastMessageDate = data[data.length-1].date

    if (data){
        res.status(200).send({status: 'success', texts: data})
    } else{
        res.status(400).send({status: 'failed'})
    }
})

router.get('/newMessages', async (req, res) => {
    const data = await newMessage.find({date: { $gt: lastMessageDate }});
    if (data){
        res.status(200).send({status: 'success', texts: data})
    } else{
        res.status(400).send({status: 'failed'})
    }
})

module.exports = router;