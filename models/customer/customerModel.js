// const connection = require('../../core/db_connection');
const model = require('../../core/index');

exports.register = async (req) => {
    let result = await model.registerUser(req);
    console.log(result);
    return result;
}
exports.login = async(req)=>{
    let result = await model.loginUser(req);
    console.log('customer model result: ',result);
    return result;
}
exports.searchFlight = async(req) => {
    console.log('inside customer model.searchFlight');
    let result = await model.searchFlight(req);
    console.log('result in customer model: ',result);
    return result;
}
exports.addPassengers = async(req) => {
    let result = await model.addPassengers(req);
    console.log(result);
    return result;
}
