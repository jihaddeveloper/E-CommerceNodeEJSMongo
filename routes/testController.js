//  Author: Mohammad Jihad Hossain
//  Create Date: 27/11/2019
//  Modify Date: 29/11/2019
//  Description: Restful API testing

//Library import
const router = require("express").Router();
const mongoose = require("mongoose");

//Image saving library
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const path = require("path");
const crypto = require("crypto");
const Grid = require("gridfs-stream");

//Model Import
const Test = require("../models/test");

//Import secret file
const secret = require("../config/secret");

//Test RestAPI

//Get the Profile for provided ID
router.get("/testProfile/:id", (req, res, next) => {
  const id = req.params.id;
  Test.findById(id)
    .select("name email")
    .exec()
    .then(result => {
      console.log(result);
      if (result) {
        res.status(200).json({
          result: result,
          description: "Get all the test Profiles",
          request: { type: "GET", url: "http://localhost:3000/testProfiles" }
        });
      } else {
        res.status(404).json({
          message: "No data found for privided ID"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//Image saving storage part
var filename;
// create storage engine
const storage = new GridFsStorage({
  url: secret.database,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        //console.log(buf);
        if (err) return reject(err);
        filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "fs"
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// //Profile Save with multiple image
// router.post("/testProfileSave", upload.array("images"), (req, res, next) => {
//   //Image
//   var img_arr = [];
//   req.files.map(async image => {
//     img_arr.push(`http://localhost:3000/image/${image.filename}`);
//   });

//   //https://ecom-admin.herokuapp.com/image/${image.filename}

//   const test = new Test({
//     _id: new mongoose.Types.ObjectId(),
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     images: img_arr
//   });
//   test.save().then(result => {
//     console.log(result);
//     res
//       .status(201)
//       .json({
//         message: "Save successfully",
//         result: result,
//         request: {
//           type: "GET",
//           discription: "Get the test Profile for provided ID",
//           url: "http://localhost:3000/testProfile/" + result._id
//         }
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).json({
//           error: err
//         });
//       });
//   });
// });

//Profile Save with single image
router.post("/testProfileSave", upload.single("image"), (req, res, next) => {
  const test = new Test({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    image: `http://localhost:3000/image/${req.file.filename}`
  });
  test.save().then(result => {
    console.log(result);
    res
      .status(201)
      .json({
        message: "Save successfully",
        result: result,
        request: {
          type: "GET",
          discription: "Get the test Profile for provided ID",
          url: "http://localhost:3000/testProfile/" + result._id
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
});

//Get Image
var con = mongoose.connection;
let gfs;
con.once("open", function() {
  gfs = Grid(con.db, mongoose.mongo);
  gfs.collection("fs");
});
// route for fetching image
router.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (file != null) {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }
  });
});

module.exports = router;
