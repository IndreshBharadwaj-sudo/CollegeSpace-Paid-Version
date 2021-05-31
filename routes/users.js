const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const users = require('../controllers/users');
const { isValidUser } = require('../middleware');

router.route('/register')
.get( users.renderRegister)
.post(isValidUser,catchAsync(users.register))

router.route('/login')
.get( users.renderLogin)
.post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.renderLogout);

module.exports = router;
