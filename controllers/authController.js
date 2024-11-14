const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const transporter = require('../config/email');

exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({
      username,
      password
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ 
      message: 'User created successfully',
      user: { id: user._id, username: user.username }, 
      token 
    });
  } catch (error) {
    console.error('Error in signup process:', error);
    res.status(500).json({ message: 'Error in signup process' });
  }
};

exports.login = async (req, res) => {
  try {
    const {  username, password } = req.body;
    const user = await User.findOne({ username });
     
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid login credentials' });
    }
    
   
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      message: 'Login successful',
      user: { id: user._id, username: user.username, email: user.email }, 
      token 
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Error in login process' });
  }
};