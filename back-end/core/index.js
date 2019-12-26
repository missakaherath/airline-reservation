const fs = require('fs');
const path = require('path');
const db = require('./db_connection')
const bcrypt = require('bcryptjs')
let json_response = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../response_format.json'), 'utf8'));

async function registerUser(req) {
    console.log('index.js');
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
                const hashedPwd = hash;
                console.log(hashedPwd);
                let sql = `INSERT INTO user (discount_ID,first_name,last_name,address,email,password,status) VALUES ('${req.body.discount_ID}','${req.body.first_name}','${req.body.last_name}','${req.body.address}','${req.body.email}','${hashedPwd}','${req.body.status}')`;
                let query = db.query(sql, (err, result) => {
                    console.log('result');
                    if (err) {
                        console.log('error: ', err);
                        json_response['success'] = false;
                        json_response['message'] = 'error';
                        // json_response['token'] = '';
                        reject('reject');
                    }
                    else {
                        json_response['success'] = true;
                        json_response['message'] = 'successfully registered';
                        // json_response['token'] = '';
                        resolve(json_response);
                    }
                });
            })
        })
        console.log(req.body.discount_ID, req.body.first_name, req.body.last_name, req.body.address, req.body.email, req.body.password, req.body.status);


    });

    // res.redirect('/login'); //rederects to login page
}

async function loginUser(req) {
    console.log('inside login user in index.js')
    return promise = new Promise((resolve, reject) => {
    
        console.log('inside promise in index.js')

        let sql = `SELECT * FROM user WHERE email='${req.body.email}'`;
        db.query(sql, (err, result) => {
            if (err || result.length == 0) {
                console.log('error: ', err);
                // json_response['token'] = ''
                reject(json_response);
            }
            else {
                const hashedPwd = `SELECT password FROM user WHERE email='${req.body.email}'`;
                bcrypt.compare(req.body.password, hashedPwd, (err, res) => {
                    if (err) {
                        console.log('an error occured');
                        // json_response['success'] = false;
                        // json_response['message'] = 'an error occured in databasse';
                        // json_response['token'] = ''
                        reject(json_response);
                    }
                    else if (res) {
                        console.log('correct password');
                        // json_response['token'] = ''
                        resolve(json_response);
                    }
                    else {
                        console.log('incorrect password');
                        // json_response['success'] = false;
                        // json_response['message'] = 'incorrect password';
                        // json_response['token'] = ''
                        console.log(json_response);
                        reject(json_response);
                    }
                })
            }

        })
    }).then(() => {
        json_response['success'] = true;
        json_response['message'] = 'you logged in';
        console.log('inside then: ', json_response);
        return json_response;
    }).catch(() => {
        json_response['success'] = false;
        json_response['message'] = 'incorrect email or password';
        console.log('inside catch: ', json_response);
        return json_response;        
    })
}

async function searchFlight(req){
    let departureAirport = req.body.departureAirport;
    let arrivalAirport = req.body.arrivalAirport;
    let departureDate = req.body.departureDate;
    let passengers = req.body.passengers;
    let requiredClass = req.body.requiredClass;

    let sql = `SELECT `;
}

module.exports = { registerUser, loginUser };