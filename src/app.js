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



// innit database
require('./dbs/init.Mongodb');
// const {checkOverload} = require("./helpers/check.connect");
// checkOverload();


//init router
app.use('/',require('./routers'));

//handling error

app.use((req,res,next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
})

app.use((error,req,res,next)=> {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status:"error",
        code :statusCode,
        message:error.message || 'interal server error'
    })
})
module.exports = app;