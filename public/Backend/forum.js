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
let dateStart = '0001-01-01'
let dateEnd = '9999-12-31'
let fromUser = '.*'

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
        res.status(200).send({status:"success", number: Math.ceil(checkPages / pageLim), limit: pageLim})
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
    console.log('Last Id: ' + lastId)

    const data = await newMessage.find({

        date: {$gte: new Date(dateStart + "T00:00:00.000Z"),
            $lte: new Date(dateEnd+ "T23:59:59.999Z") 
        },
        username : {$regex : fromUser},
        id: { $gt: lastId }
    
    });
    
    if (data){
        res.status(200).send({status: 'success', texts: data})
    } else{
        res.status(400).send({status: 'failed'})
    }

    lastId = await newMessage.find().sort({ id: -1}).limit(1)
    lastId = lastId[0].id

})

router.post('/newFilters', async (req, res) => {
    const {filters} =  req.body;

    pageNum = filters.pageNum
    pageLim = filters.pageLim
    fromUser = filters.fromUser
    dateStart = filters.dateStart
    dateEnd = filters.dateEnd


    toId = pageNum * pageLim 
    fromId = toId - pageLim + 1

   
   /*
    const data = await newMessage.find({

        //id: {$gte: fromId, $lte: toId},
        username : {$regex : fromUser}
    
    }).skip(((pageNum-1)*pageLim)).limit(pageLim); */

    const data = await newMessage.find({

        date: {$gte: new Date(dateStart+ "T00:00:00.000Z"),
            $lte: new Date(dateEnd+ "T23:59:59.999Z")
        },
        //id: {$gte: fromId, $lte: toId},
        username : {$regex : fromUser}
    
    });

 
    console.log(data)

    let pageData = []
    let from = ((pageNum-1)*pageLim)
    const To = (pageLim * pageNum) 
    const len = data.length

    while(from < To){

        if(from < data.length){


            pageData.push(data[from])
        } 
        from++;

    }

    

    //Specific filter is for paging purposes, to know how much data there is based on filters
    let specificFilter = false
    if (fromUser != '.*' || dateStart != '' || dateEnd != ''){
        specificFilter = true
    }

    if (data){

        res.status(200).send({status: 'success', specificFilter: specificFilter, length: data.length, texts: pageData})
        
    } else{
        res.status(400).send({status: 'failed'})
    }


})

module.exports = router;