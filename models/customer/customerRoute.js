const customerController = require('./customerController');

exports.configRoutes = (app) => {
    console.log('route is working');
    app.post('/register',[customerController.register]);
    app.post('/login',[customerController.login]);
    app.post('/search_flight',[customerController.searchFlight]);
    app.post('/addPassengers',[customerController.addPassengers]);
    app.post('/availableSeats',[customerController.availableSeats]);
} 
//scheduleid,classid,userid,=>seatList