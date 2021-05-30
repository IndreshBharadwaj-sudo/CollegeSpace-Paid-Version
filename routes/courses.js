const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Course = require('../models/courses');
const courses = require('../controllers/courses');
const { courseSchema } = require('../schemas.js');
const { isLoggedIn,isAuthor,validateCourse } = require('../middleware');

router.route('/')
.get(catchAsync(courses.index))
.post(isLoggedIn, validateCourse, catchAsync(courses.createCourse))

router.get('/new', isLoggedIn, catchAsync(courses.renderNewForm))

router.route('/:id')
    .get(catchAsync(courses.showCourse))
.put(isLoggedIn, isAuthor, validateCourse, catchAsync(courses.updateCourse))
.delete (isLoggedIn, isAuthor, catchAsync(courses.deleteCourse))



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(courses.renderEditForm));



module.exports = router;