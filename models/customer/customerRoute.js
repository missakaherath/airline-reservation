const customerController = require('./customerController');

exports.configRoutes = (app) => {
    console.log('route is working');
    app.post('/register',[customerController.register]);
    app.post('/login',[customerController.login]);
    app.post('/search_flight',verifyToken,[customerController.searchFlight]);
    app.post('/addPassengers',verifyToken,[customerController.addPassengers]);
    app.post('/availableSeats',verifyToken,[customerController.availableSeats]);
}

//verify token
function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader!=='undefined'){
        console.log('inside if');
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        console.log('inside else');
        res.sendStatus(403);
    }
}