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
  dustbinReadingModel
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
  // console.log("Request.body", req.body)

  if (!mongoose.isValidObjectId(req.body.dustbinId)) {
    res.status(404)
      .send(`dustbinId is not valid, must be a single String of 12 bytes or a string of 24 hex characters
      Eg:{
        "dustbinId":"41224d776a326fb40f000001",
    }`);
    console.log("dustbinId is not valid");
    return;
  }

  dustbinModel
    .findOne({ _id: req.body.dustbinId })
    .exec((err, dustbin) => {
      if (!err) {
        // Checking if dustbin exits or not
        if (dustbin) {

          let newDustbinReadingModel = new dustbinReadingModel({
            dustbinId: req.body.dustbinId,
            dustbinLevel: req.body.dustbinLevel,
            unit: req.body.unit,
          });

          newDustbinReadingModel.save((err, data) => {
            if (!err) {
              res.send({
                message: "dustbin level is saved"
              });
              console.log("dustbin level is saved:", data);
            } else {
              res.status(500).send("Internal server error");
              console.log("Internal server error:", err);
            }
          });
        } else {
          res.status(400).send({
            noDataMessage: "dustbin not found please create first",
          });
          console.log("dustbin not found", dustbin);
          return;
        }
      } else {
        console.log(err);
        res.status(500).send("Internal server error");
        return;
      }
    });
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

// dustbin readings
app.get("/dustbinreadings", (req, res, next) => {
  if (!req.query.dustbinId) {
    res
      .status(400)
      .send({
        errorMessage: "provide dustbinId in query params to get dustbins readings",
      });
    console.log("dustbinId is missing");
    return;
  }
  if (
    !mongoose.isValidObjectId(req.query.dustbinId)
  ) {
    res.status(404)
      .send(`dustbinId is not valid, must be a single String of 12 bytes or a string of 24 hex characters
    Eg:{
      "dustbinId": 41224d776a326fb40f000001
    }`);
    console.log("dustbinId is not valid");
    return;
  }

  // Checking if dustbin exists or not
  dustbinModel.find({ _id: req.query.dustbinId }, (err, data) => {
    if (!err) {
      if (data.length) {
        //dustbin found

        // Checking if dustbin exits or not
        dustbinModel
          .findOne({ _id: req.query.dustbinId })
          .exec((err, dustbin) => {
            if (!err) {
              // Checking if dustbin exits or not
              if (dustbin) {
                // dustbin found
                dustbinReadingModel
                  .find({
                    dustbinId: req.query.dustbinId,
                  })
                  .sort({ _id: -1 })
                  .exec((err, dustbinReading) => {
                    if (!err) {
                      console.log(dustbinReading, "dustbinReading found");
                      res.send(dustbinReading);
                    } else {
                      console.log("Internal server error", err);
                      res.status(500).send("Internal server error, " + err);
                    }
                  });
              } else {
                res.status(400).send({
                  noDataMessage: "dustbin not found please create first",
                });
                console.log("dustbin not found", dustbin);
                return;
              }
            } else {
              console.log(err);
              res.status(500).send("Internal server error");
              return;
            }
          });
      } else {
        res.status(400).send({
          noDataMessage: "dustbin not found create first",
        });
        console.log("dustbin not found create first ", data);
        return;
      }
    } else {
      res.status(500).send(`Internal server Error`);
      console.log("Internal server Error", err);
      return;
    }
  });
});

// Server listening ////////////////////////////////////////////////////////////
server.listen(PORT, () => {
  console.log("Server is Running:", PORT);
});
