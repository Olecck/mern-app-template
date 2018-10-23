// environment variables
process.env.NODE_ENV = 'development';

// config variables
const config = require('./config/config.js');

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(`mongodb://${global.gConfig.database}:${global.gConfig.db_port}/${global.gConfig.app_name}`,
    { useNewUrlParser: true });

const router = require('./routes');

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.use('/auth', router.auth);

app.listen(global.gConfig.node_port, function () {
    console.log(global.gConfig.app_name + ' app listening on port ' + global.gConfig.node_port);
});