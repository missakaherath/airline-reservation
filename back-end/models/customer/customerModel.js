// const connection = require('../../core/db_connection');
const model = require('../../core/index');

exports.register = async (req) => {
    let result = await model.registerUser(req);
    console.log(result);
    return result;
}
exports.login = async(req)=>{
    // let email = req.body.email;
    // let password = req.body.password;
    // console.log('inside customer model.','username: ',email,' passwpord: ',password);
    let result = await model.loginUser(req);
    console.log('customer model result: ',result);
    return result;
}
exports.searchFlight = async (req) => {
    let result = model.searchFlight(req);
    return result;
}
