const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Use multer without specifying dest to handle in-memory uploads
const upload = multer();

router.post('/', auth, upload.array('images', 10), carController.createCar);
router.get('/', auth, carController.getCars);
router.get('/search', auth, carController.searchCars);
router.get('/:id', auth, carController.getCar);
router.patch('/:id', auth, upload.array('images', 10), carController.updateCar);
router.delete('/:id', auth, carController.deleteCar);

module.exports = router;
