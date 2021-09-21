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


// Post tank water level readings
app.post("/dustbinlevel", (req, res, next) => {
  if (!req.body.dustbinId || !req.body.distance || !req.body.unit) {
    res.status(400).send(
      `Information missing
        For Eg:{
          "dustbinId":"515313215315165",
          "distance":"20",
          "unit":"cm"
        }`,
    );
    return;
  }
  // TODO: save data to firebase database
  console.log("Request.body", req.body)
  res.send({
    "message": "Successfully saved"
  })
});


// Server listening ////////////////////////////////////////////////////////////
server.listen(PORT, () => {
  console.log("Server is Running:", PORT);
});
