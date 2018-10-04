const express = require('express');

// environment variables
process.env.NODE_ENV = 'development';

// config variables
const config = require('./config/config.js');


// the app itself
const app = express();

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.listen(global.gConfig.node_port, function () {
    console.log(global.gConfig.app_name + ' app listening on port ' + global.gConfig.node_port);
});