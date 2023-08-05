const { Schema } = require('mongoose');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const url ="mongodb+srv://chiruvaradani123:chiru123@filmopediadb.jdaa3ea.mongodb.net/Filmopedia"
// const url = "mongodb://localhost:27017/Filmopedia"

const usersSchema = Schema({
    Username: { type: String,required: [true, 'name is required']},
    email: { type: String,required: [true, 'email is required']},
    password: { type: String,required: [true, 'pass is required']},
    mobile: { type: String,required: [true, 'mobile is required']}, 
    profile:{type:String},
    watchlist:[{type:Number}],
    favMovies:[{type:Number}]
    
}, { collection: "users", timestamps: true })



let connection = {}

//Returns model object of "Users" collection
connection.getCollection = async () => {
    //Establish connection and return model as promise
    try {
        console.log("Connection to DB success");
        const database = await mongoose.connect(url, { useNewUrlParser: true });
        return database.model('users', usersSchema);
    } catch (error) {
        let err = new Error("Could not connect to the database");
        err.status = 500;
        throw err;
    }
}

module.exports = connection;
