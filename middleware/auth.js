const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your user model

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).send({ error: 'Please authenticate.' });
    }

    req.user = user; // Attach the authenticated user to the request object
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(401).send({ error: 'Invalid or expired token.' });
  }
};

module.exports = auth;