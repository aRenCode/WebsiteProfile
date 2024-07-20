const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
//const Schema = require('../model/model');
const regSchema = require('../model/messagesForumModel')

mongoose.pluralize(null)

const router = express.Router()
let lastMessageDate;
let pageLim = 20
let lastId = 0;
let pageNum = 1
let dateStart = '0001-01-01'
let dateEnd = '9999-12-31'
let fromUser = '.*'
let threadName = 'Messages'
const secondaryCon = mongoose.createConnection('mongodb+srv://pryvya:test123@aren.a04dm6v.mongodb.net/threadMessages')
let newMessage =  secondaryCon.model(threadName, regSchema)






db = secondaryCon.connection






router.post('/addMessage', async (req, res)=>
    {

        if(lastId != 0){
        lastId = await newMessage.find().sort({ date: -1}).limit(1)
        lastId = lastId[0].id
    }



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

router.post('/threadChange', (req, res) =>{
    const {parcel} = req.body
    if(parcel){

        
        threadName = parcel.threadName
        console.log(threadName)

        //secondaryCon.collection(threadName)
        newMessage = secondaryCon.model(threadName, regSchema)
        res.status(200).send({success:"success"})
    } else{
        res.status(400).send({success:"failed"})
    }
})

router.get('/getLast', async (req, res) => {

    //get last id 
    lastId = await newMessage.find().sort({ id: -1}).limit(1)

    if(lastId.length > 0){
    lastId = lastId[0].id
    } else{
        lastId = 0
    }



    const data = await newMessage.find().sort({ id: 1}).limit(pageLim);

    //getInfoForServer
    if(data.length > 0){
    lastMessageDate = data[data.length-1].date
    }
    else{
       //const currentDate = new Date()
        //const [year, month, date] = [currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()]
        lastMessageDate = new Date()
    }

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