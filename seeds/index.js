const courses = require('./courses');
const mongoose = require('mongoose');
const Course = require('../models/courses');

mongoose.connect('mongodb://localhost:27017/collegespace', {
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
    for (let i = 0; i < 3; i++)
    {
        const course = new Course({
            author:'60b24fa43aae9f15e47c5a6b',
            title: `${ courses[i].title }`,
            description: `${ courses[i].description }`,
            image: 'https://www.gpca.org.ae/wp-content/uploads/2018/12/shutterstock_566877226-6498x2166.jpg'
        })
        await course.save();
    }
}
seedDB().then(() =>
{
    mongoose.connection.close();
})