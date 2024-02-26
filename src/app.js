require('dotenv').config()
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');

const app = express();

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));



//init router
app.use('/',require('./routers'));
// innit database
require('./dbs/init.Mongodb');
// const {checkOverload} = require("./helpers/check.connect");
// checkOverload();
//handling error

module.exports = app;