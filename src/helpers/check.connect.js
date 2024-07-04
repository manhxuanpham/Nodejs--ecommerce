'user strict'


const mongoose = require('mongoose')
const os = require('os');
const process = require('process')
const _SECONDS = 5000
// check connect
const countConnect = () => {
    const numConnect = mongoose.connect.length
    console.log(`Number of connect:${numConnect}`)
}
// check overLoad 

const checkOverload = ()=> {
    setInterval(()=> {
        const numConnect = mongoose.connect.length
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        console.log("actives connections:",numConnect);
        console.log("memory usage:",memoryUsage/1024/1024,"MB");
        const maxConnections = numCores * 5;
        if (numConnect > maxConnections) {
            console.log("connection overload")
        }
    },_SECONDS)
}
module.exports = {
    countConnect,
    checkOverload
}