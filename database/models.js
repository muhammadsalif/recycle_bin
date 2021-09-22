// Database configuration ///////////////////////////////////////////////////////////////
const mongoose = require('mongoose');

/////////////////////////////////////////////////////////////////////////
// Mongoose connections
let dbURI = "mongodb+srv://dbuser:dbpassword@cluster0.ho7xe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
    console.log("Mongoose is connected")
})

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected")
    process.exit(1);
})

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {  //this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});

// Database Models //////////////////////////////////////////////////////////////////////
// Db Schemas & Models

// dustbins
var dustbinSchema = new mongoose.Schema({
    dustbinName: { type: String },
    createdOn: { type: Date, default: Date.now },
});
var dustbinModel = mongoose.model("dustbin", dustbinSchema);

// dustbin Readings
var dustbinReadingSchema = new mongoose.Schema({
    dustbinId: { type: mongoose.Schema.Types.ObjectId, ref: 'dustbin' },
    dustbinLevel: { type: Number },
    unit: { type: String },
    createdOn: { type: Date, default: Date.now },
});
var dustbinReadingModel = mongoose.model("dustbinreading", dustbinReadingSchema);

module.exports = {
    dustbinModel,
    dustbinReadingModel
}