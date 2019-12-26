const fs = require('fs');
const path = require('path');
const db = require('./db_connection')
const bcrypt = require('bcryptjs')
let json_response = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../response_format.json'), 'utf8'));

// async function registerUser(req) {
//     console.log('index.js');
//     return new Promise((resolve, reject) => {
//         bcrypt.genSalt(10, function (err, salt) {
//             bcrypt.hash(req.body.password, salt, function (err, hash) {
//                 const hashedPwd = hash;
//                 console.log(hashedPwd);
//                 let sql = `INSERT INTO user (discount_ID,first_name,last_name,address,email,password,status) VALUES ('${req.body.discount_ID}','${req.body.first_name}','${req.body.last_name}','${req.body.address}','${req.body.email}','${hashedPwd}','${req.body.status}')`;
//                 let query = db.query(sql, (err, result) => {
//                     console.log('result');
//                     if (err) {
//                         console.log('error: ', err);
//                         json_response['success'] = false;
//                         json_response['message'] = 'error';
//                         reject('reject');
//                     }
//                     else {
//                         json_response['success'] = true;
//                         json_response['message'] = 'successfully registered';
//                         resolve(json_response);
//                     }
//                 });
//             })
//         })
//         console.log(req.body.discount_ID, req.body.first_name, req.body.last_name, req.body.address, req.body.email, req.body.password, req.body.status);
//     });
// }

// async function loginUser(req) {
//     console.log('inside login user in index.js')
//     return promise = new Promise((resolve, reject) => {  
//         console.log('inside promise in index.js')
//         let sql = `SELECT password FROM user WHERE email='${req.body.email}'`;
//         db.query(sql, (err, result) => {
//             console.log('result pwd: ', result[0]['password']);
//             if (err || result.length == 0) {
//                 console.log('error: ', err);
//                 reject(json_response);
//             }
//             else {
//                 bcrypt.compare(req.body.password, result[0]['password'], (err, res) => {
//                     if (err) {
//                         console.log('an error occured: ', err);
//                         reject(json_response);
//                     }
//                     else if (res) {
//                         console.log('correct password');
//                         resolve(json_response);
//                     }
//                     else {
//                         console.log('incorrect password');
//                         console.log(json_response);
//                         reject(json_response);
//                     }
//                 })
//             }
//         })
//     }).then(() => {
//         json_response['success'] = true;
//         json_response['message'] = 'you logged in';
//         console.log('inside then: ', json_response);
//         return json_response;
//     }).catch(() => {
//         json_response['success'] = false;
//         json_response['message'] = 'incorrect email or password';
//         console.log('inside catch: ', json_response);
//         return json_response;        
//     })
// }

// async function searchFlight(req){
//     return promise = new Promise((resolve,reject)=>{
//     let departureAirport = req.body.departureAirport;
//     let arrivalAirport = req.body.arrivalAirport;
//     let departureDate = req.body.departureDate;
//     let passengers = req.body.passengers;
//     let requiredClass = req.body.requiredClass;
//     console.log('inside index.js-searchFlight');
//     let sql = `SELECT COUNT(class_ID),plane_ID FROM seat WHERE plane_ID = (SELECT plane_ID FROM vwplaneidbyschedule WHERE departure='${departureAirport}' AND arrival='${arrivalAirport}' AND date='${departureDate}') AND class_ID='${requiredClass}' AND status=0 GROUP BY plane_ID;`;
//     db.query(sql,(err,result)=>{
//         console.log('result: ',result);
//         console.log('plane id: ',result[0]['plane_ID']);
//         let availableSeats = result[0]['COUNT(class_ID)'];
//         console.log('available seats: ',availableSeats); //number of available seats according to given details    
//         if(passengers>availableSeats){
//             console.log('no flights available');
//             json_response['message'] = 'no flights available';
//             reject(json_response);
//         }
//         else{
//             //this part should be run inside a for loop, one itteration per a single plane id in previous o/p
//             let sql2 = `SELECT date,departure_time, arrival_time FROM schedule WHERE flight_ID = (SELECT flight.flight_ID FROM plane_flight LEFT JOIN flight ON plane_flight.flight_ID=flight.flight_ID WHERE plane_ID='${result[0]['plane_ID']}' AND departure='${departureAirport}' AND arrival='${arrivalAirport}')`;
//             db.query(sql2,(err,result2)=>{
//                 console.log('result2: ',result2);
//                 json_response['message'] = 'available schedule details are stored in the data array';
//                 json_response['data'].push(result[0]['plane_ID']);
//                 json_response['data'].push(result2[0]['date'].toISOString().slice(0,10).replace(/T/, ' '));
//                 json_response['data'].push(result2[0]['departure_time']);
//                 json_response['data'].push(result2[0]['arrival_time']);
//                 console.log(json_response);
//                 resolve(json_response);
//             })
//         }
//     })
//     }).then(()=>{
//         json_response['success'] = true;
//         return json_response;
//     }).catch(()=>{
//         json_response['success'] = false;
//         return json_response;
//     })
// }

// async function addPassengers(req){
//     return promise = new Promise((resolve,reject)=>{
//         //this should be updated
//         let user_ID = req.body.user_ID;
//         let passport_no = req.body.passport_no;
//         let age = req.body.age;
//         let first_name = req.body.first_name;
//         let last_name = req.body.last_name;
//         let sql = `INSERT INTO passenger (user_ID,first_name,last_name,passport_no,age) VALUES ('${user_ID}','${first_name}','${last_name}','${passport_no}','${age}')`;
//         db.query(sql,(err,result)=>{
//             if(err){
//                 json_response['message'] = 'couldnt add passenger to the db';
//                 reject(json_response);
//             }
//             else{
//                 json_response['message'] = 'passenger added to the db';
//                 resolve(json_response);
//             }
//         })
//         }).then(()=>{
//             json_response['success'] = true;
//             return json_response;
//         }).catch(()=>{
//             json_response['success'] = false;
//             return json_response;
//         })
// }

// module.exports = {addPassengers};