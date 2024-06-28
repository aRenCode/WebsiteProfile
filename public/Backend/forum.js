const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
//const Schema = require('../model/model');

const router = express.Router()



mongoose.connect('mongodb+srv://pryvya:test123@aren.a04dm6v.mongodb.net/Users')






console.log('Check123')

router.get('/test', (req, res)=>
    {
        
        console.log('test123: ')
        res.status(200).json({info: 'test!'})
    });

module.exports = router;