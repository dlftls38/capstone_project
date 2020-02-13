// [ CONFIGURE mongoose ]
var mongoose    = require('mongoose');

module.exports = () => {
    var db = mongoose.connection;
    db.on('error', console.error);
    db.once('open', function(){
        // CONNECTED TO MONGODB SERVER
        console.log("Connected to mongod server");
    });
    // CONNECT TO MONGODB SERVER
    mongoose.connect('mongodb+srv://capstone:capstone@cluster0-b4lig.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
};
