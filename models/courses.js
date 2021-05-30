const mongoose = require('mongoose');
const Material = require('./material');
const User = require('./material');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: String,
    description: String,
    author:
        {
        type: Schema.Types.ObjectId,
        ref: 'User'
        },
    materials: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Material'
        }
    ]
})

CourseSchema.post('findOneAndDelete',async function (doc) {
    if (doc)
    {
        await Material.deleteMany({
            _id: {
                $in: doc.materials
            }
        })
        }
})

module.exports = mongoose.model('Courses', CourseSchema);