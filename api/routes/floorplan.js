
const { authenticateUser, authenticateAdmin} = require("../middleware/auth");
const express = require("express");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs-extra");
//const upload = multer({ dest: "uploads/" });
const Floorplan = require("../models/floorplan");
var directory = path.join(__dirname + "/uploads");

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      let path = "./public/uploads";
      fs.mkdirsSync(path);
      callback(null, path);
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    },
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
  }),

  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
//   fileFilter: fileFilter,
// });

router.get("/", authenticateUser, (req, res, next) => {
  Floorplan.find( {org: req.user.org} )
    .select("name _id floorplanImage")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        images: docs.map((doc) => {
          return {
            name: doc.name,
            _id: doc._id,
            floorplanImage: "https://safereturn.herokuapp.com/" + doc.floorplanImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/floorplan/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", authenticateAdmin, upload.single("floorplanImage"), (req, res, next) => {
  console.log(req.file);
  const floorplan = new Floorplan({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    floorplanImage: req.file.path,
    org: req.user.org
  });
  console.log(floorplan._id)
  floorplan
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Image uploaded successfully",
        createdFloorplan: {
          name: result.name,
          floorplanImage: result.floorplanImage,
          _id: result._id,
          request: {
            type: "GET",
            url: "http//localhost:3000/floorplan/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:floorplanId", async (req, res, next) => {
  const id = req.params.floorplanId;
  try {
    const result = await Floorplan.findById(id);
    if (result) {
      res.status(200).json({
        floorplan: result,
      });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete("/:floorplanId", async (req, res, next) => {
  try {
    const id = req.params.floorplanId;
    const result = await Floorplan.findById(id);
    result.remove();

    res.status(200).json({
      message: "Floor plan deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

module.exports = router;
