const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const newThreads = require('../model/threadsModel');


mongoose.connect('mongodb+srv://pryvya:test123@aren.a04dm6v.mongodb.net/Users')

let lastThreadId;


const router = express.Router()


router.post('/addThread', async (req, res) => {
    const {info } = req.body

    if (info){
        const addThread = new newThreads({

            id: lastThreadId+1,
            name: info.name,
            date: info.date

        })

        const check = await newThreads.find({name: info.name}).limit(1)
        
        
        if(check.length > 0){

        res.status(400).send({status: 'failed'})
        } else{
            await addThread.save()
            lastThreadId++;
            res.status(200).send({status: 'success'})
            
        }
        
           
        
    } else{
        res.status(400).send({status: 'failed'})
    }
})

router.get('/getThreads', async (req, res) => {
    

        const threads = await newThreads.find()
        if (threads){
         lastThreadId = threads[threads.length-1].id
        res.status(200).send({status: 'success', threads: threads})
    } else{
    
        res.status(400).send({status: 'failed'})
    }
    
})

router.post('/findThreads', async (req, res) => {
    
    const {info} = req.body

    const threads = await newThreads.find({
        name:{
            $regex: info.name,
            //$options: 'i'
        }
    })
    if (threads){
    res.status(200).send({status: 'success', threads: threads})
} else{

    res.status(400).send({status: 'failed'})
}

})


module.exports = router