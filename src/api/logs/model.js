const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LogSchema = new Schema({
    type : {
        type : Number,
        required : true  
    },
    searchedWord : {
        type : String,
        required : true
    },
    qtyResults : {
        type: Number,
        required : true
    },
    date : {
        type : Date,
        required : true
    }
})

const Log = mongoose.model("Log", LogSchema)

module.exports = {
    Log
}