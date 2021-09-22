var express = require("express");
var cors = require("cors");
var morgan = require("morgan");
var app = express();
// var mongoose = require("mongoose");
var http = require("http");
var server = http.createServer(app);
// const socketIo = require("socket.io");
// const mqtt = require("mqtt");
const cookieParser = require("cookie-parser");
// var jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 5000;
var SERVER_SECRET = process.env.SERVER_SECRET || "1234";
var mongoose = require("mongoose");
var {
  dustbinModel,
  dustbinReadingReadingModel
} = require("./database/models");

app.use(express.json());

app.use(
  cors({
    origin: true,
  }),
);

app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());

// dustbin level readings
app.post("/dustbinlevel", (req, res, next) => {
  if (!req.body.dustbinId || !req.body.dustbinLevel || !req.body.unit) {
    res.status(400).send(
      `Information missing
        For Eg:{
          "dustbinId":"dustbinId"
          "dustbinLevel":"dustbinLevel"
          "unit":"unit"  
        }`,
    );
    return;
  }
  console.log("Request.body", req.body)

  let newDustbinReadingModel = new dustbinReadingModel({
    dustbinId: req.body.dustbinId,
    dustbinLevel: req.body.dustbinLevel,
    unit: req.body.unit,
  });

  newDustbinReadingModel.save((err, data) => {
    if (!err) {
      res.send("Water Level is saved");
      console.log("Water Level is saved:", data);
      // Implementation of runtime reading of sensor || distance
      io.emit(req.body.tankId, { event: "ADDED_ITEM", data: data });
    } else {
      res.status(500).send("Internal server error");
      console.log("Internal server error:", err);
    }
  });

  // TODO: save data to firebase database

});

// create dustbin
app.post("/dustbin", (req, res, next) => {
  if (!req.body.dustbinName) {
    res.status(400).send(
      `atleast dustbinName is required
      For Eg:{
        "dustbinName":"Abc"
      }`,
    );
    console.log("atleast dustbinName is required");
    return;
  }

  //Create dustbin here
  let newDustbinModel = new dustbinModel({
    dustbinName: req.body.dustbinName,
  });
  newDustbinModel.save((err, data) => {
    if (!err) {
      console.log("Dustbin created successfully");
      res.send({
        message: "Dustbin created successfully"
      })
      return;
    } else {
      res.status(500).send("Internal server error");
      console.log("Internal server error:", err);
      return;
    }
  });

});

// Server listening ////////////////////////////////////////////////////////////
server.listen(PORT, () => {
  console.log("Server is Running:", PORT);
});
