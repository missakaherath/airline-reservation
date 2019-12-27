const customerModel = require('./customerModel');
const fs = require("fs");
const path = require('path');
const jwt = require('jsonwebtoken');
const config = JSON.parse(fs.readFileSync(path.join(__dirname,'../../core/env.config.json'), 'utf8'));

exports.register = (req, res) => {
    console.log('register controller is working');
    customerModel.register(req).then((result)=>{
        if(result.success===true){
            res.json(result);
            console.log('controller op');
        }
        else{
            res.json(result);   
        }
    })
}

exports.login = (req, res) => {
    console.log('login controller is working');
    customerModel.login(req).then((result)=>{      
        if(result.success===true){
            console.log('result: ',result);
            const email = req.body.email;
            let token = jwt.sign({email:email},config.secret,config.options);
            if(result.data==''){
                result.data.push(email);
            }
            result.token = token;
            res.json(result);
        }
        else{
            console.log('else part');
            res.json(result);
        }
    })
}

exports.searchFlight = (req,res) => {
    customerModel.searchFlight(req).then((result)=>{
        res.json(result);
    })
}

exports.addPassengers = (req,res) => {
    customerModel.addPassengers(req).then((result)=>{
        res.json(result);
    })
}
exports.availableSeats = (req,res) => {
    customerModel.availableSeats(req).then((result)=>{
        res.json(result);
    })
}