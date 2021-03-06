const db = require('../../core/db_connection');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs')
let json_response = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../response_format.json'), 'utf8'));

exports.register = async (req) => {
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
                            reject('reject');
                        }
                        else {
                            json_response['success'] = true;
                            json_response['message'] = 'successfully registered';
                            resolve(json_response);
                        }
                    });
                })
            })
            console.log(req.body.discount_ID, req.body.first_name, req.body.last_name, req.body.address, req.body.email, req.body.password, req.body.status);
        });
    }
    let result = await registerUser(req);
    console.log(result);
    return result;
}

exports.login = async(req) => { 
    async function loginUser(req) {
        console.log('inside login user in index.js')
        return promise = new Promise((resolve, reject) => {  
            console.log('inside promise in index.js')
            let sql = `SELECT password FROM user WHERE email='${req.body.email}'`;
            db.query(sql, (err, result) => {
                console.log('result pwd: ', result[0]['password']);
                if (err || result.length == 0) {
                    console.log('error: ', err);
                    reject(json_response);
                }
                else {
                    bcrypt.compare(req.body.password, result[0]['password'], (err, res) => {
                        if (err) {
                            console.log('an error occured: ', err);
                            reject(json_response);
                        }
                        else if (res) {
                            console.log('correct password');
                            resolve(json_response);

                            //inserting airport ids and names into data array in json response
                            let sql = `SELECT airport_ID, airport_code FROM airport`;
                            db.query(sql,(err,result)=>{
                                json_response.data=[];
                                if(err){
                                    console.log('an error occured');
                                }
                                else{
                                    console.log(result);
                                    for(i=0;i<result.length;i++){
                                        temp=[];
                                        temp.push(result[i]['airport_ID'],result[i]['airport_code']);
                                        json_response.data.push(temp);
                                        console.log(result[i]['airport_ID'],result[i]['airport_code']);
                                    }
                                }
                            })
                        }
                        else {
                            console.log('incorrect password');
                            console.log(json_response);
                            reject(json_response);
                        }
                    })
                }
            })
        }).then(() => {
            return promise = new Promise((resolve, reject) => {
                json_response['success'] = true;
                let sql = `SELECT user_ID FROM user WHERE email='${req.body.email}'`;
                db.query(sql, (err,result)=>{
                    console.log('inside query');
                    if(err){
                        json_response['user_id']="id not found";
                        reject(json_response);
                    }
                    else{
                        json_response['user_id']=result;
                        resolve(json_response);
                    }
                });
                json_response['message'] = 'you logged in';
                console.log('inside then: ', json_response);
                return json_response;
            }).then(()=>{
                return json_response;
            }).catch(()=>{
                return json_response;
            });
        }).catch(() => {
            json_response['success'] = false;
            json_response['message'] = 'incorrect email or password';
            console.log('inside catch: ', json_response);
            return json_response;        
        })
    }
    console.log('before call the fn..........');
    let result = await loginUser(req);
    console.log('customer model result: ',result);
    return result;
}

exports.searchFlight = async(req) => {
    async function searchFlight(req){
        return promise = new Promise((resolve,reject)=>{
        let departureAirport = req.body.departureAirport;
        let arrivalAirport = req.body.arrivalAirport;
        let departureDate = req.body.departureDate;
        let passengers = req.body.passengers;
        let requiredClass = req.body.requiredClass;
        let sqlDep = `SELECT airport_code FROM airport WHERE airport_ID='${departureAirport}'`;
        db.query(sqlDep,(err,result)=>{
            if(err){
                console.log('error finding departure airport');
            }
            else{
                console.log('departure: ',result);
                json_response['departure'] = result[0]['airport_code'];
            }
        })
        let sqlArrival = `SELECT airport_code FROM airport WHERE airport_ID='${arrivalAirport}'`;
        db.query(sqlArrival,(err,result)=>{
            if(err){
                console.log('error finding arrival airport');
            }
            else{
                console.log('arrival: ',result);
                json_response['arrival'] = result[0]['airport_code'];
            }
        })
        let sql = `SELECT COUNT(class_ID),plane_ID FROM seat WHERE plane_ID = (SELECT plane_ID FROM vwplaneidbyschedule WHERE departure='${departureAirport}' AND arrival='${arrivalAirport}' AND date='${departureDate}') AND class_ID='${requiredClass}' AND status=0 GROUP BY plane_ID;`;
        db.query(sql,(err,result)=>{
            if(err || result.length==0){
                console.log('no schedules available');
                json_response['message'] = 'no schedules are available';
                resolve(json_response);
            }
            else{
            console.log('result: ',result);
            console.log('plane id: ',result[0]['plane_ID']);
            let availableSeats = result[0]['COUNT(class_ID)'];
            console.log('available seats: ',availableSeats); //number of available seats according to given details    
            if(passengers>availableSeats){
                console.log('no flights available');
                json_response['message'] = 'no flights available';
                reject(json_response);
            }
            else{
                //this part should be run inside a for loop, one itteration per a single plane id in previous o/p
                let sql2 = `SELECT schedule_ID,date,departure_time, arrival_time FROM schedule WHERE flight_ID = (SELECT flight.flight_ID FROM plane_flight LEFT JOIN flight ON plane_flight.flight_ID=flight.flight_ID WHERE plane_ID='${result[0]['plane_ID']}' AND departure='${departureAirport}' AND arrival='${arrivalAirport}')`;
                let sql3 =`SELECT class_ID,class_name,price FROM class`;
                db.query(sql3,(err,result)=>{
                    if(err){
                        console.log('an database error occured');
                    }
                    else{
                        json_response['prices']=[];
                        console.log(result);
                        for(i=0;i<3;i++){
                            pricesArr=[];
                            pricesArr.push(result[i]['class_ID'],result[i]['class_name'],result[i]['price']);
                            json_response['prices'].push(pricesArr);
                        }
                    }
                })
                db.query(sql2,(err,result2)=>{
                    json_response['data']=[];
                    console.log('result2 : ',result2);
                    for(i=0;i<result2.length;i++){
                        availableSchedules=[];
                        availableSchedules.push(result2[i]['schedule_ID'],result[i]['plane_ID'],result2[i]['date'].toISOString().slice(0,10).replace(/T/, ' '),result2[i]['departure_time'],result2[i]['arrival_time']);
                        json_response['data'].push(availableSchedules);
                    }
                    console.log('result2: ',result2);
                    json_response['message'] = 'available schedule details are stored in the data array';
                    console.log(json_response);
                    resolve(json_response);
                })
            }
        }})
        }).then(()=>{
            json_response['success'] = true;
            return json_response;
        }).catch(()=>{
            json_response['success'] = false;
            return json_response;
        })
    }

    console.log('inside customer model.searchFlight');
    let result = await searchFlight(req);
    console.log('result in customer model: ',result);
    return result;
}
exports.addPassengers = async(req) => {

    async function addPassengers(req){
        return promise = new Promise((resolve,reject)=>{
            console.log('inside cust model');

            //adding arrival time and departuretime to the response

            let schedule_ID = req.body.schedule_ID;
            let sql =`SELECT arrival_time,departure_time FROM schedule WHERE schedule_ID='${schedule_ID}'`;
            db.query(sql,(err,result)=>{
                if(err){
                    console.log('error occured');
                } else {
                    json_response['arrival time']=result[0]['arrival_time'];
                    json_response['departure time']=result[0]['departure_time'];
                }
            })

            //select plane id
            let sql2 = `SELECT plane_ID FROM plane_flight WHERE flight_ID=(SELECT flight_ID FROM schedule WHERE schedule_ID='${schedule_ID}')`;
            db.query(sql2,(err,result)=>{
                if(err){
                    console.log('error occured');
                } else {
                    json_response['plane_ID']=result[0]['plane_ID'];
                }
            })

            //calculate the price
            let numOfPassengeres = req.body.passengerArr.length;
            let class_ID = req.body.class_ID;
            let sqlPrices = `SELECT price FROM class WHERE class_ID='${class_ID}'`;
            db.query(sqlPrices,(err,result)=>{
                if(err){
                    console.log('an error occured');
                } else {
                    json_response['total price']=(result[0]['price']*numOfPassengeres);
                }
            })

            //this should be updated
            let user_ID = req.body.user_ID;
            for(i=0;i<req.body.passengerArr.length;i++){
                let first_name = req.body.passengerArr[i][0];
                let last_name = req.body.passengerArr[i][1];
                let passport_no = req.body.passengerArr[i][2];
                let age = req.body.passengerArr[i][3];
                let seat_number = req.body.passengerArr[i][4];
                
                //let className = req.body.className;

                let sql = `INSERT INTO passenger (user_ID,first_name,last_name,passport_no,age,seat_number) VALUES ('${user_ID}','${first_name}','${last_name}','${passport_no}','${age}','${seat_number}')`;
                    db.query(sql,(err,result)=>{
                        if(err){
                            console.log('error inserting data');
                            json_response['message'] = 'couldnt add passenger to the db';
                            reject(json_response);
                        }
                        else{
                            json_response['message'] = 'passenger added to the db';
                            resolve(json_response);
                        }
                    })
            }
            }).then(()=>{
                json_response['success'] = true;
                return json_response;
            }).catch(()=>{
                json_response['success'] = false;
                return json_response;
            })
    }

    let result = await addPassengers(req);
    console.log(result);
    return result;
}

exports.availableSeats = async(req) => {
    async function availableSeats(req){
        return promise = new Promise((resolve,reject)=>{
        json_response['data']=[];
        let schedule_ID = req.body.schedule_ID;
        let class_ID = req.body.class_ID;
        let sql = `SELECT seat_number FROM seat WHERE status=0 AND class_ID='${class_ID}' AND plane_ID=(SELECT plane_ID FROM plane_flight WHERE flight_ID=(SELECT flight_ID FROM schedule WHERE schedule_ID='${schedule_ID}'));`
        db.query(sql,(err,result)=>{
            if(err){
                console.log('an err has been occured');
                reject(json_response);
            }
            else{
                console.log(result[0]['seat_number']);
                var i;
                for(i=0;i<result.length;i++){
                    json_response['data'].push(result[i]['seat_number']);
                    console.log(json_response);
                }
                resolve(json_response);
            }
        })
        }).then(()=>{
            json_response['success'] = true;
            json_response['message'] = "following array contains the available seats of the requested plane";
            return json_response;
        }).catch(()=>{
            json_response['success'] = false;
            return json_response;
        })
    }
    let result = await availableSeats(req);
    console.log('result: ',result);
    return result;
}

exports.getAirports = async(req) => {
    async function getAirports(req){
        return promise = new Promise((resolve,reject)=>{
            let sqlGetAirports = `SELECT airport_ID,airport_code FROM airport`;
            db.query(sqlGetAirports,(err,result)=>{
                if(err){
                    console.log('error has occured');
                    reject(err);
                } else {
                    console.log(result);
                     for(i=0;i<result.length;i++){
                         let temp=[]
                         temp.push(result[i]['airport_ID']);
                         temp.push(result[i]['airport_code']);
                         json_response['data'].push(temp);
                     }
                    resolve(result);
                }
            })
        }).then(()=>{
            json_response['success']= true;
            return json_response;
        }).catch(()=>{
            json_response['success']= false;
            return json_response;

        })
    }
    let result = await getAirports(req);
    return result;
}

exports.changeSeat = async(req) => {
    async function changeSeat(req){
        return promise = new Promise((resolve,reject)=>{
            let sqlSendSeats = `SELECT seat_number FROM seat WHERE plane_ID='${req.body.plane_ID}' AND class_ID='${req.body.class_ID}' AND status=0`;
            db.query(sqlSendSeats,(err,result)=>{
                if(err){
                    console.log('an error occured');
                    reject(err);
                } else {
                    console.log('result',result);
                     for(i=0;i<result.length;i++){
                         json_response['data'].push(result[i]['seat_number']);
                     }
                     resolve(json_response);
                }
            })
        }).then(()=>{
            json_response['success']=true;
            return json_response;
        }).catch(()=>{
            json_response['success']=false;
            return json_response;
        })
    }
    let result = await changeSeat(req);
    return result;
}

exports.removeReservation = async(req) => {
    async function removeReservation(req){
        return promise = new Promise((resolve,reject)=>{
            let sqlResDelete = `DELETE FROM reserve WHERE reserve_ID='${req.body.reserve_ID}';`;
            db.query(sqlResDelete,(err,result)=>{
                if(err){
                    console.log('an error occured: ',err);
                    json_response['message']='couldbt delete the reservation as an error has been occured';
                    json_response['success']=false;
                    reject(json_response);
                } else{
                    json_response['message']='reservation deleted successfully';
                    json_response['success']=true;
                    resolve(json_response);
                }
            })
        }).then(()=>{
            return json_response;
        }).catch(()=>{
            return json_response;
        })
    }
    let result = await removeReservation(req);
    return result;
}

exports.editBook = async(req) => {
    async function editBook(req){
        return promise = new Promise((resolve,reject)=>{
            let reserve_ID = req.body.reserve_ID;
            let passenger_ID = req.body.passenger_ID;
            let plane_ID = req.body.plane_ID;
            let sql = `SELECT first_name,last_name,passport_no,age,seat_number FROM passenger WHERE passenger_ID='${passenger_ID}'`;
            db.query(sql,(err,result)=>{
                if(err){
                    console.log('an error occured: ',err);
                    //reject(json_response);
                } else{
                    json_response['first name']=result[0]['first_name'];
                    json_response['last name']=result[0]['last_name'];
                    json_response['passport number']=result[0]['passport_no'];
                    json_response['age']=result[0]['age'];
                    json_response['seat number']=result[0]['seat_number'];
                    //resolve(json_response);
                }
            })

            let sqlGetClass = `SELECT class_ID FROM seat WHERE seat_number=(SELECT seat_number FROM reserve WHERE reserve_ID='${reserve_ID}')`;
            db.query(sqlGetClass,(err,result)=>{
                if(err){
                    console.log('an error occured: ',err);                
                    reject(json_response);
                } else {
                    console.log('class id result: ',result[0]['class_ID']);
                    json_response['class_ID']=result[0]['class_ID'];
                    resolve(json_response);
                }
            })
        }).then(()=>{
            json_response['success'] = true;
            return json_response;
        }).catch(()=>{
            json_response['success'] = false;
            return json_response;
        })
    }
    let result = await editBook(req);
    return result;
}