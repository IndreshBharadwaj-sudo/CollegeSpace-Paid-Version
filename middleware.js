const { courseSchema,materialSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Course = require('./models/courses');
const Material = require('./models/material');
module.exports.isLoggedIn = (req, res, next) =>
{
    if (!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You Must Be Signed In First!')
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCourse = (req, res, next) =>
{
    
    const { error } = courseSchema.validate(req.body);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else
        next();
}
module.exports.isAuthor = async (req, res, next) =>
{
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course.author.equals(req.user._id))
    {
        req.flash('error', 'You Dont Have Permission To Do That!');
        return res.redirect(`/courses/${id}`);
    }
    next();
}
module.exports.isMaterialAuthor = async (req, res, next) =>
{
    const {id, materialId } = req.params;
    const material = await Material.findById(materialId);
    if (!material.author.equals(req.user._id))
    {
        req.flash('error', 'You Dont Have Permission To Do That!');
        return res.redirect(`/courses/${id}`);
    }
    next();
}

module.exports.validateMaterial = (req, res, next) =>
{
    
    const { error } = materialSchema.validate(req.body);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else
        next();
}

module.exports.isValidUser = (req, res, next) =>
{
    if (!req.body.email.includes("student.nitw.ac.in"))
    {
        req.flash('error', 'Please Enter A Valid Student Mail!')
        return res.redirect('/register');
    }
    else
        next();
}