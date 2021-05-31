const courses = require('./courses');
const mongoose = require('mongoose');
const Course = require('../models/courses');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/collegespace';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connnection error:"));
db.once("open", () =>
{
    console.log("Database Connected");
})

const seedDB = async () =>
{
    await Course.deleteMany({});
    // for (let i = 0; i < 4; i++)
    // {
    //     const course = new Course({
    //         author:'60b3e8dbe7dc8500150e283c',
    //         title: `${ courses[i].title }`,
    //         description: `${ courses[i].description }`
    //     })
    //     await course.save();
    // }
}
seedDB().then(() =>
{
    mongoose.connection.close();
})