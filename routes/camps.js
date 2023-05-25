const express = require('express');
const router = express.Router();
const camps = require('../controllers/camps')
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const { isLoggedIn, validateCamp, isAuthor } = require('../middleware');
const { campSchema } = require('../Schema');
const ExpressError = require('../utils/expressError')
const Camp = require('../models/campground');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })

router.route('/')
     .get(catchAsync(camps.index))
     .post(isLoggedIn, upload.array('image'), validateCamp, catchAsync(camps.createCamp))
// .post(upload.array('image'), (req, res) => {
//      console.log(req.body, req.files);
//      res.send("IT F'KIN WORKED")
// })

router.route('/new')
     .get(isLoggedIn, camps.renderNewForm)

router.route('/:id')
     .get(catchAsync(camps.showCamp))
     .put(isLoggedIn, isAuthor, upload.array('image'), validateCamp, catchAsync(camps.editCamp))
     .delete(isLoggedIn, isAuthor, catchAsync(camps.deleteCamp))

router.route('/:id/edit')
     .get(isLoggedIn, isAuthor, catchAsync(camps.renderEditForm))




module.exports = router;