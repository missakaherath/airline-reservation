const customerModel = require('./customerModel');
const fs = require("fs");
const path = require('path');
const jwt = require('jsonwebtoken');
const config = JSON.parse(fs.readFileSync(path.join(__dirname,'../../core/env.config.json'), 'utf8'));

// const db_config = JSON.parse(fs.readFileSync(path.join(__dirname,'../config/db_config.json')));

exports.register = (req, res) => {
    console.log('register controller is working');
    customerModel.register(req).then((result)=>{
        if(result.success===true){
            res.json(result);
            console.log('controller op');
            // res.redirect('./login');
        }
        else{
            res.json(result);
            res.redirect('./register');
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
            result.data.push(email);
            result.token = token;
            res.json(result);
        }
        else{
            console.log('else part');
            res.json(result);
            //res.redirect('./login');
        }
    })
}

exports.searchFlight = (req,res) => {
    console.log('searchflight is working');
    customerModel.searchFlight(req).then((result)=>{
        
    })
}