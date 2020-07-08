const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
// const upload = multer({ dest: "uploads/" });
const Floorplan = require('../models/floorplan')
const storage = multer.diskStorage({
    detination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.get('/', (req, res, next) => {
    Floorplan.find()
        .select('name _id floorplanImage')
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                products: docs.map((doc) => {
                    return {
                        name: doc.name,
                        _id: doc._id,
                        floorplanImage: doc.floorplanImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/floorplan/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', upload.single('floorplanImage'), (req, res, next) => {
    console.log(req.file)
    const floorplan = new Floorplan({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        floorplanImage: req.file.path
    })
    floorplan
        .save()
        .then((result) => {
            console.log(result)
            res.status(201).json({
                message: 'Image uploaded successfully',
                createdFloorplan: {
                    name: result.name,
                    floorplanImage: result.floorplanImage,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http//localhost:3000/floorplan/' + result._id
                    }
                }
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.get('/:floorplanId', (req, res, next) => {
    const id = req.params.floorplanId
    Floorplan.findById(id)
        .select('name _id floorplanImage')
        .exec()
        .then((doc) => {
            if (doc) {
                res.status(200).json({
                    floorplan: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/floorplan'
                    }
                })
            } else {
                res.status(404).json({ message: ' Provided ID is not valid' })
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ error: err })
        })
})

router.delete('/:floorplanId', (req, res, next) => {
    const id = req.params.floorplanId
    Floorplan.remove({ _id: id })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'Image deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:5000/floorplan',
                    body: { name: 'String' }
                }
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router
