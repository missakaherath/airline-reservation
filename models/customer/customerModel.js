// const connection = require('../../core/db_connection');
const model = require('../../core/index');

exports.register = async (req) => {
    let discountID = req.body.discountID;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let address = req.body.address;
    let email = req.body.email;
    let password = req.body.password;
    let status = req.body.status;
    // let hashedPassword = bcrypt.hashSync(password, 10)

  

    let result = await model.registerUser(req);
    console.log(result);
    return result;
}
exports.login = async(req)=>{
    let email = req.body.email;
    let password = req.body.password;

    let result = await model.loginUser(req);
    console.log('customer model result: ',result);
    return result;
}
