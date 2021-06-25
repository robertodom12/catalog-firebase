const mongoose = require('mongoose');
const settings = require('./settings');

mongoose.connect(settings.mongoUrlDev,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true,
});
    
mongoose.Promise = global.Promise;
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function() {
    console.log('connection successfull!')
});

db.on('disconnected', function () { 
    console.log('Mongoose default connection disconnected'); 
});
// If the Node process ends, close the Mongoose connection 
db.on('SIGINT', function() {   
    mongoose.connection.close(function () { 
      console.log('Mongoose default connection disconnected through app termination'); 
      process.exit(0); 
    }); 
}); 
