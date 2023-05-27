const { MongoClient } = require('mongodb');
let dbConnection;

module.exports = {
    connectToDb: (cb)=>{
        MongoClient.connect('mongodb+srv://Felix:Ade@nodejs.i2xjxlr.mongodb.net/bookstore?retryWrites=true&w=majority')
        .then((client)=>{
             dbConnection = client.db()
             return cb();
        })
        .catch((err)=>{
           console.log(err);
           return cb(err);
        })
    },
    getDb: ()=> dbConnection
};