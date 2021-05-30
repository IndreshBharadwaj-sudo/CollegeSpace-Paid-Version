const Material = require('../models/material');
const Course = require('../models/courses');
const { cloudinary } = require('../cloudinary/index');

module.exports.addMaterial = async (req, res) =>
{
    const course = await Course.findById(req.params.id);
    const material = new Material(req.body.material);
    material.author = (req.user._id);
    material.files.url = req.file.path;
    material.files.filename = req.file.filename;
    material.files.originalname = req.file.originalname;
    course.materials.push(material);
    console.log(material);
    await material.save();
    await course.save();
    req.flash('success', 'Successfully Added a new Material');
    res.redirect(`/courses/${course._id}`);
}

module.exports.deleteMaterial=async (req, res) =>
{
    const { id, materialId } = req.params;
    await Course.findByIdAndUpdate(id, { $pull: { material: materialId } });
    const material = await Material.findById(materialId);
    await cloudinary.uploader.destroy(material.files.filename);
    await Material.findByIdAndDelete(materialId);
    req.flash('success', 'Successfully Deleted a Material');
    res.redirect(`/courses/${id}`);
}