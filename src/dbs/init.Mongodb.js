
const mongoose = require('mongoose')
const {db:{host,name,port} } =require('../configs/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`
const { countConnect} = require('../helpers/check.connect')

// sử dụng strategy parten để kết nối
class Database {
    constructor() {
        this.connect();
    }
    //connect
    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug',true) // in lại các hoạt động khi query
            mongoose.set('debug',{color:true})
        }

        mongoose.connect(connectString).then( _ => {
            console.log("connect mogodb succed",countConnect)})
        .catch((err)=>{
            console.log("Error connecting to MongoDB:",err)
        })
    }
    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database();

        }
        return Database.instance
    }
}
const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;