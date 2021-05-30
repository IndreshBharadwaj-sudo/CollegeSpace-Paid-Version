const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Material = require('../models/material');
const { materialSchema,courseSchema } = require('../schemas.js');
const Course = require('../models/courses');
const { isLoggedIn,validateMaterial,isMaterialAuthor } = require('../middleware')
const materials = require('../controllers/materials');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

router.get('/new',isLoggedIn,catchAsync(async (req, res) =>
{
    const { id } = req.params;
    res.render('courses/newmaterial',{id});
}))

router.post('/', isLoggedIn, validateMaterial,upload.single('material[files]'),catchAsync(materials.addMaterial));

router.delete('/:materialId', isLoggedIn, isMaterialAuthor, catchAsync(materials.deleteMaterial));

module.exports = router;