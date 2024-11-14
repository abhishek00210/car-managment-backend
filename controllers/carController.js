const Car = require('../models/Car');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.createCar = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);

    // Upload images to Cloudinary
    const imageUploadPromises = req.files.map(file =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'cars' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer); // Use buffer directly
      })
    );

    const uploadedImages = await Promise.all(imageUploadPromises);

    const car = new Car({
      ...req.body,
      user: req.user._id,
      images: uploadedImages.map(image => ({
        public_id: image.public_id,
        url: image.secure_url,
      })),
    });

    await car.save();
    res.status(201).send(car);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).send({ message: 'Error creating car', error: error.message });
  }
};

exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find({ user: req.user._id });
    res.send(cars);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getCar = async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, user: req.user._id });
    if (!car) {
      return res.status(404).send();
    }
    res.send(car);
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).send({ message: 'Car not found' });
    }

    car.title = req.body.title || car.title;
    car.description = req.body.description || car.description;
    car.tags = req.body.tags ? JSON.parse(req.body.tags) : car.tags;

    if (req.files && req.files.length > 0) {
      // Upload new images
      const imageUploadPromises = req.files.map(file =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'cars' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        })
      );

      const uploadedImages = await Promise.all(imageUploadPromises);
      car.images = uploadedImages.map(image => ({
        public_id: image.public_id,
        url: image.secure_url,
      }));
    }

    const updatedCar = await car.save();
    res.send(updatedCar);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(400).send({ message: 'Error updating car', error: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!car) {
      return res.status(404).send();
    }
    
    // Delete images from Cloudinary
    const deletePromises = car.images.map(image => 
      cloudinary.uploader.destroy(image.public_id)
    );
    await Promise.all(deletePromises);
    
    res.send(car);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.searchCars = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const cars = await Car.find({
      user: req.user._id,
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } },
      ],
    });
    res.send(cars);
  } catch (error) {
    res.status(500).send(error);
  }
};