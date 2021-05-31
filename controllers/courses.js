const Course = require('../models/courses');

module.exports.index = async (req, res) =>
{
    const courses = await Course.find({});
    res.render('courses/index', { courses });
}

module.exports.renderNewForm=async (req, res) =>
{
    res.render('courses/new');
}

module.exports.createCourse=async (req, res) =>
{
    const course = new Course(req.body.course);
    course.author = req.user._id;
    // console.log(req.body)
    await course.save();
    req.flash('success', 'Successfully made a new course');
    res.redirect(`/courses/${course._id}`);
}

module.exports.showCourse=async (req, res) =>
{
    const course = await Course.findById(req.params.id).populate({
        path: 'materials',
        populate: {
            path:'author'
        }
    }).populate('author');
    if (!course)
    {
        req.flash('error', 'Cannot find That Course!')
        return res.redirect('/courses');
    }
    res.render('courses/show', { course});
}

module.exports.renderEditForm=async (req, res) =>
{
    const course = await Course.findById(req.params.id);
    if (!course)
    {
        req.flash('error', 'Cannot find That Course!')
        return res.redirect('/courses');
        }
    res.render('courses/edit', { course });
}

module.exports.updateCourse = async (req, res) =>
{
    const { id } = req.params;
    const cou = await Course.findByIdAndUpdate(id, { ...req.body.course });
    req.flash('success', 'Successfully Editted a course');
    res.redirect(`/courses/${ cou._id }`);
};

module.exports.deleteCourse=async (req, res) =>
{
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted a course');
    res.redirect(`/courses`);
}