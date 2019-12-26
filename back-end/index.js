const express = require('express');
const app = express();
const body_parser = require('body-parser');
const customerRoute = require('./models/customer/customerRoute');

app.use(body_parser.json());
app.use(express.json());
customerRoute.configRoutes(app);

app.listen(3000);
console.log('port is working');
module.exports = app;