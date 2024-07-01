const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
//const Schema = require('../model/model');

const router = express.Router()



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

module.exports = router;