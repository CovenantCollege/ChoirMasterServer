
// setup express
var express = require('express');
var app = express();
var port = 8675;

// setup router
var router = require('./app/routes');
app.use('/', router);

// set static files (css, images, etc) location
app.use(express.static('public'));

// start server
app.listen(port, function () {
    console.log('This test is running on port:',port,'\n');
});