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
    //console.log(req);
    console.log('login controller is working');
    customerModel.login(req).then((result)=>{      
        if(result.success===true){ //entered userwent through the db authentication and came back
            console.log('result: ',result);
            const email = req.body.email;
            let token = jwt.sign({email:email},config.secret,config.options);
            if(result.data==''){
                result.data.push(email);
            } 
            result.token = token; //putting the generated token into the json response
            res.json(result);
        }
        else{
            console.log('else part');
            res.json(result);
        }
    })
}

exports.searchFlight = (req,res) => {
    jwt.verify(req.token,config.secret,(err,authData)=>{
        if(err){
            res.sendStatus(403);
        } else {
            customerModel.searchFlight(req).then((result)=>{
                res.json(result);
            })
        }
    })
}

exports.addPassengers = (req,res) => {
    jwt.verify(req.token,config.secret,(err,authData)=>{
        if(err){
            res.sendStatus(403);
        } else {
            customerModel.addPassengers(req).then((result)=>{
                res.json(result);
            })
        }
    })
}

exports.availableSeats = (req,res) => {
    jwt.verify(req.token,config.secret,(err,authData)=>{
        if(err){
            res.sendStatus(403);
        } else {
            customerModel.availableSeats(req).then((result)=>{
                res.json(result);
            })
        }
    })
}